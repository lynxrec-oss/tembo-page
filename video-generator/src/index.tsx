import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { WhatIsTembo } from './compositions/WhatIsTembo';
import { HowToBuilder } from './compositions/HowToBuilder';
import { HowToAI } from './compositions/HowToAI';
import { MasterExplainer } from './compositions/MasterExplainer';
import { TrafficPersonalization } from './compositions/TrafficPersonalization';

const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 90-Second Master Explainer Video (16:9 Landscape - 1920x1080) */}
      <Composition
        id="master-explainer-16x9"
        component={MasterExplainer}
        durationInFrames={5220} // 87 seconds at 60fps
        fps={60}
        width={1920}
        height={1080}
      />

      {/* 90-Second Master Explainer Video (9:16 Portrait - 1080x1920) */}
      <Composition
        id="master-explainer-9x16"
        component={MasterExplainer}
        durationInFrames={5220} // 87 seconds at 60fps
        fps={60}
        width={1080}
        height={1920}
      />

      <Composition
        id="what-is-tembo"
        component={WhatIsTembo}
        durationInFrames={682} // 22.7 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="how-to-builder"
        component={HowToBuilder}
        durationInFrames={1728} // 57.6 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="how-to-ai"
        component={HowToAI}
        durationInFrames={1706} // 56.8 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="traffic-personalization"
        component={TrafficPersonalization}
        durationInFrames={780} // 26.0 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

registerRoot(RemotionRoot);
