import React from 'react';
import ReactDOM from 'react-dom';
import * as dg from 'dis-gui';

import * as random from './random';

export default class GUI extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      seed: this.props.seed
    };
  }

  render() {
    return (
      <dg.GUI
        style={{
          top: '16px',
          left: '16px',
          highlight: '#0d8',
        }}
      >
        <dg.Text label='Seed' value={this.state.seed} onFinishChange={this.props.onFinishChangeSeed.bind(this)}/>
        <dg.Button label='Randomize Seed' onClick={this.onClickRandomizeSeed.bind(this)}/>
        <dg.Number
          label='Width'
          min={1}
          max={this.props.maxTextureSize}
          step={1}
          value={this.props.width}
          decimals={0}
          onFinishChange={this.props.onFinishChangeWidth}
        />
        <dg.Number
          label='Height'
          min={1}
          max={this.props.maxTextureSize}
          step={1}
          value={this.props.height}
          decimals={0}
          onFinishChange={this.props.onFinishChangeHeight}
        />
        <dg.Checkbox label='Point Stars' checked={this.props.renderPointStars} onChange={this.props.onChangeRenderPointStars}/>
        <dg.Checkbox label='Stars' checked={this.props.renderStars} onChange={this.props.onChangeRenderStars}/>
        <dg.Checkbox label='Sun' checked={this.props.renderSun} onChange={this.props.onChangeRenderSun}/>
        <dg.Checkbox label='Nebulae' checked={this.props.renderNebulae} onChange={this.props.onChangeRenderNebulae}/>
        <dg.Checkbox label='Short Scale' checked={this.props.shortScale} onChange={this.props.onChangeShortScale}/>
      </dg.GUI>
    )
  }

  onClickRandomizeSeed() {
    let seed = random.generateRandomSeed();
    this.setState({
      seed: seed,
    });
    this.props.onFinishChangeSeed(seed);
  }

}
