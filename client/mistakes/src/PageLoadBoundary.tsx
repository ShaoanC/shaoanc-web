import { Component, type ReactNode } from 'react';

export class PageLoadBoundary extends Component<{ children: ReactNode; resetKey?: string }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidUpdate(previous: Readonly<{ children: ReactNode; resetKey?: string }>) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    return this.state.failed
      ? <div className="inline-alert" role="alert">页面加载失败，请刷新后重试。<button type="button" onClick={() => window.location.reload()}>刷新页面</button></div>
      : this.props.children;
  }
}
