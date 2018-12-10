import React, { PureComponent } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Text/* , Group */ } from 'react-konva';

// class ColoredRect extends PureComponent {
//   state = {
//     color: 'green',
//   };
//   handleClick = () => {
//     this.setState({
//       color: Konva.Util.getRandomColor(),
//     });
//   };
//   render() {
//     return (
//       <Rect
//         x={20}
//         y={20}
//         width={500}
//         height={500}
//         fill={this.state.color}
//         // shadowBlur={5}
//         onClick={this.handleClick}
//       />
//     );
//   }
// }

export default class KonvaApp extends PureComponent {
  state = {
    color: 'green',
  };

  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor(),
    });
  };

  render() {
    // const image = new Image();
    // image.src = 'http://i.imgur.com/A6H6xHF.png';
    // image.style.width = '500px';
    // image.style.height = '500px';
    // image.style.objectFit = 'contain';

    // image.height= '500px';
    // image = {
    //   src: 'http://i.imgur.com/A6H6xHF.png',
    //   width: '500px',
    //   height: '500px',
    // }
    const ColoredRect = () => (
      <Rect
        x={20}
        y={20}
        width={500}
        height={500}
        fill={this.state.color}
        onClick={this.handleClick.bind(this)}
      />
    );

    return (
      <Stage width={window.innerWidth - 180} height={window.innerHeight - 64}>
        <Layer>
          <Text text="Try click on rect" />
          {/* <ColoredRect /> */}
          {ColoredRect()}
        </Layer>
      </Stage>
    );
  }
}

