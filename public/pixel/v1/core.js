/**
 * TEMBO SMART PIXEL — Core Tracking Library (v1)
 * 
 * Serverless tracking engine. Captures client-side context, resolves traffic sources,
 * and records events directly into the Tembo Cloud Firestore database via REST.
 * Features a dual-mode local fallback buffer for seamless sandbox verification.
 */
(function() {
  console.log("[Tembo Pixel] Script loaded successfully.");

  // Retrieve any early actions pushed to the script prior to full load
  var queue = window.tembo ? (window.tembo.q || []) : [];
  
  var config = {
    creatorId: null
  };

  /**
   * Initializes the pixel with the creator's unique herd ID
   */
  function init(id) {
    config.creatorId = id;
    console.log("[Tembo Pixel] Initialized tracking ID:", id);
    
    // Sync the connection state in localStorage for the local verification dashboard
    try {
      localStorage.setItem("tembo_pixel_connection_state", "connected");
      localStorage.setItem("tembo_pixel_last_init", new Date().toISOString());
      localStorage.setItem("tembo_pixel_connected_id", id);
    } catch (e) {
      console.warn("[Tembo Pixel] Failed to write connection state to localStorage:", e);
    }
  }

  /**
   * Dispatches tracking events directly to the Firestore REST API endpoint
   */
  function track(eventType, data) {
    if (!config.creatorId) {
      console.warn("[Tembo Pixel] Cannot track event. Pixel is not initialized. Please call tembo('init', 'ID') first.");
      return;
    }

    data = data || {};
    var referrer = document.referrer || "";
    var source = "direct";
    
    // Resolve referrer source patterns into key channels
    if (referrer.indexOf("tiktok.com") !== -1) {
      source = "tiktok";
    } else if (referrer.indexOf("instagram.com") !== -1) {
      source = "instagram";
    } else if (referrer.indexOf("youtube.com") !== -1) {
      source = "youtube";
    } else if (referrer.indexOf("t.co") !== -1 || referrer.indexOf("twitter.com") !== -1) {
      source = "twitter";
    } else if (referrer.indexOf("google.com") !== -1 || referrer.indexOf("bing.com") !== -1) {
      source = "search";
    }

    // Capture precise telemetry details
    var payload = {
      creatorId: config.creatorId,
      eventType: eventType || "view",
      source: data.source || source,
      url: window.location.href,
      linkId: data.linkId || null,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    console.log("[Tembo Pixel] Firing event:", eventType, payload);

    // Save to localStorage local buffer to allow offline/sandbox dashboard simulation
    try {
      var localEvents = JSON.parse(localStorage.getItem("tembo_pixel_events") || "[]");
      localEvents.push(payload);
      // Keep only last 50 events in the ring buffer
      if (localEvents.length > 50) localEvents.shift();
      localStorage.setItem("tembo_pixel_events", JSON.stringify(localEvents));
    } catch (e) {
      console.warn("[Tembo Pixel] Failed to cache event in local buffer:", e);
    }

    // Call Firestore document REST endpoint for analytics collection
    var url = "https://firestore.googleapis.com/v1/projects/tembo-page-prod-25/databases/(default)/documents/analytics";
    
    var firestoreDocument = {
      fields: {
        id: { stringValue: "evt_" + Math.random().toString(36).substring(2, 15) },
        creatorId: { stringValue: payload.creatorId },
        eventType: { stringValue: payload.eventType },
        source: { stringValue: payload.source },
        url: { stringValue: payload.url },
        linkId: payload.linkId ? { stringValue: payload.linkId } : { nullValue: null },
        timestamp: { stringValue: payload.timestamp },
        userAgent: { stringValue: payload.userAgent }
      }
    };

    // Dispatch the tracking payload
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(firestoreDocument)
    })
    .then(function(res) {
      return res.json().then(function(json) {
        if (!res.ok) {
          throw new Error(json.error ? json.error.message : "HTTP " + res.status);
        }
        return json;
      });
    })
    .then(function(result) {
      console.log("[Tembo Pixel] Event logged successfully to Firestore:", result);
      
      // Dispatch a local browser event so the simulator test page can intercept and show live console outputs
      try {
        var event = new CustomEvent("tembo_pixel_log", { 
          detail: { success: true, payload: payload, response: result } 
        });
        window.dispatchEvent(event);
      } catch (e) {}
    })
    .catch(function(err) {
      console.error("[Tembo Pixel] Failed to log event directly to Firestore:", err);
      
      try {
        var event = new CustomEvent("tembo_pixel_log", { 
          detail: { success: false, error: err.message, payload: payload } 
        });
        window.dispatchEvent(event);
      } catch (e) {}
    });
  }

  /**
   * Processes the command queue items sequentially
   */
  function processQueue() {
    while (queue.length > 0) {
      var args = queue.shift();
      var cmd = args[0];
      if (cmd === 'init') {
        init(args[1]);
      } else if (cmd === 'track') {
        track(args[1], args[2]);
      }
    }
  }

  // Replace temporary client queue function with live tracking processor
  window.tembo = function() {
    queue.push(arguments);
    processQueue();
  };

  // Run over existing items queued before load
  processQueue();
})();
