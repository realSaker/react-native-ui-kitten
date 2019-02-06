import React from 'react';
import {
  fireEvent,
  render,
} from 'react-native-testing-library';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { ModalPanel } from './modalPanel.component';
import {
  ModalComponentCloseProps,
  ModalService,
} from '../../../theme';

describe('@modal panel checks', () => {

  const showModalTestId: string = '@modal/show';
  const hideModalTestId: string = '@modal/hide';

  interface HooksProps {
    componentDidMount?: () => void;
    componentWillUnmount?: () => void;
  }

  class ModalPanelTest extends React.Component<HooksProps> {

    componentDidMount(): void {
      this.props.componentDidMount && this.props.componentDidMount();
    }

    componentWillUnmount() {
      this.props.componentWillUnmount && this.props.componentWillUnmount();
    }

    showModal() {
      ModalService.showDialog(
        <TestModal/>,
        true,
        { animationDuration: 500, animationType: 'fade' });
    }

    render() {
      return (
        <ModalPanel>
          <View>
            <Text>Modal Panel Test</Text>
          </View>
          <Button
            title='Open Modal'
            onPress={() => this.showModal()}
            testID={showModalTestId}
          />
        </ModalPanel>
      );
    }
  }

  class TestModal extends React.Component<ModalComponentCloseProps> {

    render(): React.ReactNode {
      return (
        <View>
          <Text>This is Test Modal</Text>
          <Button
            title='Close Modal'
            onPress={this.props.onCloseModal}
            testID={hideModalTestId}
          />
        </View>
      );
    }
  }

  it('* modal panel renders properly', () => {
    const panel = render(<ModalPanelTest/>);
    expect(panel).toMatchSnapshot();
  });

  it('* modal panel render with props / children checking', () => {
    const panelChild = <View><Text>Test</Text></View>;
    const panel = <ModalPanelTest children={panelChild}/>;
    const renderedPanel = render(panel);

    expect(panel.props.children).toBe(panelChild);
    expect(renderedPanel).toMatchSnapshot();
  });

  it('* modal panel l/c-hooks checks', () => {
    const componentDidMount = jest.fn();
    const componentWillUnmount = jest.fn();

    const wrapper = render(
      <ModalPanelTest
        componentDidMount={componentDidMount}
        componentWillUnmount={componentWillUnmount}
      />,
    );
    expect(componentDidMount).toHaveBeenCalled();
    wrapper.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });

  it('* close modal checking', () => {
    const application = render(<ModalPanelTest/>);
    fireEvent.press(application.getByTestId(showModalTestId));
    fireEvent.press(application.getByTestId(hideModalTestId));
    expect(application).toMatchSnapshot();
  });

});
