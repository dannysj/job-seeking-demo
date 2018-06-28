import React, { Component } from 'react';
import ReactCrop, { makeAspectCrop }  from 'react-image-crop';
import { Button } from 'semantic-ui-react'
import 'react-image-crop/dist/ReactCrop.css';
import './imgcrop.less';

export default class ImgCrop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      crop: {
        x: 0,
        y: 0,
        aspect: 1
      },
      dataUrl: this.props.dataUrl,
      inlineStyle: {
        height: '50vh',
        objectFit: 'cover'
      }
    }
  }

  onNoButtonClick = () => {
    console.log("No Clicked");
    this.props.onSuccess(null);
  }

  onYesButtonClick = () => {
    console.log(this.state.pixelCrop);
    var image = new Image();
    var handler = this;
    image.onload = () => {
      console.log('FUCK!!');
      handler.getCroppedImg(image, this.state.pixelCrop, this.props.fileName, (croppedImg)=>{
        handler.props.onSuccess(croppedImg);
      });
    };
    image.src = this.props.dataUrl;
  }

  getCroppedImg = (image, pixelCrop, fileName, callback) => {

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob

    canvas.toBlob(file => {
      file.name = fileName;
      callback(file);
    }, 'image/jpeg');
  }

  onImageLoaded = (image) => {
    // var splitName = this.state.dataUrl.split('\\').pop().split('/').pop();
    this.setState({
      crop: makeAspectCrop({
        x: 0,
        y: 0,
        aspect: 1,
        height: 20,
      }, image.naturalWidth / image.naturalHeight),
      image
    });
  }

  onCropComplete = (crop, pixelCrop) => {
    this.setState({pixelCrop: pixelCrop})
  }

  onCropChange = (crop) => {
    this.setState({crop: crop });
  }

  render() {
    console.log(this.state.crop);
    return (
      <div className="img-crop-wrapper">
        <div className="img-crop-box ">
          <ReactCrop
            {...this.state}
            src={this.state.dataUrl}

            imageStyle={this.state.inlineStyle}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
          <div className="buttonContainer">
            <Button color='green' onClick={this.onYesButtonClick}>确认</Button>
            <Button color='red' onClick={this.onNoButtonClick}>取消</Button>
          </div>
        </div>
      </div>
    );
  }
}
