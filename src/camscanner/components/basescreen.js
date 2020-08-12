import React from 'react';
export class BaseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.addListener('focus', () => {
      this.onScreenFocused();
    });
  }
  onScreenFocused() {}

  refresh() {
    this.forceUpdate();
  }

  pushPage(name) {
    this.props.navigation.push(name);
  }

  progressVisible = false;

  showProgress() {
    this.progressVisible = true;
    this.refresh();
  }

  hideProgress() {
    this.progressVisible = false;
    this.refresh();
  }
}
