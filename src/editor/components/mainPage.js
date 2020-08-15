import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import EditorMainPage from './editorMainPage';
import MainHeader from '../../ikai/components/header';
const EditorStack = createStackNavigator();

export class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.open = props.route.params.user;
  }

  render() {
    return (
      <EditorStack.Navigator initialRouteName="editorMainScreen">
        <EditorStack.Screen
          name="editorMainScreen"
          component={EditorMainPage}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('../assets/edit_header.png')}
                  view={true}
                  open={this.open}
                />
              );
            },
          }}></EditorStack.Screen>
      </EditorStack.Navigator>
    );
  }
}

export default Editor;
