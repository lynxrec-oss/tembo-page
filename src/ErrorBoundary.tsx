import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Props;
  declare context: any;
  declare setState: any;
  declare forceUpdate: any;
  declare refs: any;
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in application:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('savannah_bypass');
      localStorage.removeItem('has_active_session');
      localStorage.removeItem('active_creator_id');
    } catch (e) {
      console.warn("Could not clear storage:", e);
    }
    window.location.hash = '#/';
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', width: '100vw',
          backgroundColor: '#16130b', color: '#eae1d4',
          fontFamily: 'Inter, sans-serif',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '2rem', textAlign: 'center',
          position: 'fixed', inset: 0, zIndex: 99999
        }}>
          <div style={{
            maxWidth: '32rem', width: '100%',
            backgroundColor: '#231f17',
            border: '1px solid rgba(242, 202, 80, 0.3)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '1.5rem'
          }}>
            <div style={{
              width: '4rem', height: '4rem', borderRadius: '50%',
              backgroundColor: 'rgba(242, 202, 80, 0.1)',
              border: '1px solid rgba(242, 202, 80, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#f2ca50'
            }}>
              <AlertTriangle size={32} />
            </div>

            <div>
              <h1 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.5rem', fontWeight: 700,
                color: '#eae1d4', marginBottom: '0.5rem'
              }}>
                Application Runtime Error
              </h1>
              <p style={{
                fontSize: '0.875rem', color: '#99907c',
                lineHeight: 1.6
              }}>
                We encountered an unexpected error while rendering this page. You can try reloading or resetting your workspace state.
              </p>
            </div>

            {this.state.error && (
              <div style={{
                width: '100%', backgroundColor: '#110e07',
                border: '1px solid rgba(255, 180, 171, 0.2)',
                borderRadius: '0.75rem', padding: '1rem',
                textAlign: 'left', overflowX: 'auto',
                maxHeight: '12rem', overflowY: 'auto'
              }}>
                <p style={{
                  fontSize: '0.75rem', fontFamily: 'monospace',
                  color: '#ffb4ab', wordBreak: 'break-all',
                  margin: 0, whiteSpace: 'pre-wrap'
                }}>
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div style={{
              display: 'flex', gap: '1rem', width: '100%',
              marginTop: '0.5rem', flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReload}
                style={{
                  flex: 1, minWidth: '120px',
                  padding: '0.875rem 1.25rem',
                  borderRadius: '9999px',
                  backgroundColor: '#f2ca50', color: '#3c2f00',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700, fontSize: '0.8rem',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(242, 202, 80, 0.2)',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                <RefreshCw size={14} />
                Reload Page
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  flex: 1, minWidth: '140px',
                  padding: '0.875rem 1.25rem',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent', color: '#eae1d4',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700, fontSize: '0.8rem',
                  border: '1px solid rgba(234, 225, 212, 0.3)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                <RotateCcw size={14} />
                Reset State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
