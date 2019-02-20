import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from '../../style';
import {BaseComponent} from '../../commons';
import TouchableOpacity from '../touchableOpacity';
import View from '../view';
import asRadioGroupChild from './asRadioGroupChild';

const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = Colors.blue30;

/**
 * A Radio Button component, should be wrapped inside a RadioGroup
 */
class RadioButton extends BaseComponent {
  static displayName = 'RadioButton';

  static propTypes = {
    /**
     * The identifier value of the radio button. must be different than other RadioButtons in the same group
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    /**
     * When using RadioButton without a RadioGroup, use this prop to toggle selection
     */
    selected: PropTypes.bool,
    /**
     * Invoked when pressing the button
     */
    onPress: PropTypes.func,
    /**
     * Whether the radio button should be disabled
     */
    disabled: PropTypes.bool,
    /**
     * The color of the radio button
     */
    color: PropTypes.string,
    /**
     * The size of the radio button, affect both width & height
     */
    size: PropTypes.number,
    /**
     * The radio button border radius
     */
    borderRadius: PropTypes.number,
  };

  state = {};

  generateStyles() {
    this.styles = createStyles(this.getThemeProps());
  }

  onPress = () => {
    const {value, disabled} = this.props;
    if (!disabled) {
      _.invoke(this.props, 'onValueChange', value);
      _.invoke(this.props, 'onPress', this.isSelected());
    }
  };

  isSelected() {
    const {value, selectedValue, selected} = this.props;
    // Individual Radio Button
    if (_.isUndefined(value)) {
      return Boolean(selected);
    }
    // Grouped Radio Button
    return value === selectedValue;
  }

  getContainerStyle() {
    const {color, size, borderRadius, style: propsStyle, disabled} = this.getThemeProps();
    const style = [this.styles.container];

    if (size) {
      style.push({width: size, height: size});
    }
    if (borderRadius) {
      style.push({borderRadius});
    }
    if (color) {
      style.push({borderColor: disabled ? Colors.dark70 : color});
    }

    style.push(propsStyle);
    return style;
  }

  getSelectedStyle() {
    const {color, borderRadius, disabled} = this.getThemeProps();
    const style = [this.styles.selectedIndicator];

    if (borderRadius) {
      style.push({borderRadius});
    }
    if (color) {
      style.push({backgroundColor: disabled ? Colors.dark70 : color});
    }

    return style;
  }

  render() {
    const {style, onPress, onValueChange, ...others} = this.getThemeProps();
    const Container = onPress || onValueChange ? TouchableOpacity : View;
    return (
      <Container activeOpacity={1} {...others} style={this.getContainerStyle()} onPress={this.onPress}>
        {this.isSelected() && <View style={this.getSelectedStyle()} />}
      </Container>
    );
  }
}

function createStyles({size = DEFAULT_SIZE, borderRadius = DEFAULT_SIZE / 2, color = DEFAULT_COLOR, disabled}) {
  return StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor: disabled ? Colors.dark70 : color,
      width: size,
      height: size,
      borderRadius,
      padding: 3,
    },
    selectedIndicator: {
      backgroundColor: disabled ? Colors.dark70 : color,
      flex: 1,
      borderRadius,
    },
  });
}

export default asRadioGroupChild(RadioButton);
