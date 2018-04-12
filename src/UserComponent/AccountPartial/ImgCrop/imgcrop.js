import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import ReactCrop, { makeAspectCrop }  from 'react-image-crop';
import { Button } from 'semantic-ui-react'
import 'react-image-crop/lib/ReactCrop.scss';
import './imgcrop.css';

export default class ImgCrop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      crop: {
        x: 0,
        y: 0,
        // aspect: 16 / 9,
      },
      maxHeight: 80,
      dataUrl: this.props.dataUrl,
      inlineStyle: {
        width: '100%',
        objectFit: 'cover'
      },


    }
  }

  onNoButtonClick = () => {
    console.log("No Clicked")
    this.props.onSuccess(undefined)
  }

  onYesButtonClick = async () => {
    const { image } = this.state;
    const croppedImg = await this.getCroppedImg(image, this.state.pixelCrop, this.state.imgName);
    this.props.onSuccess(croppedImg)
  }

  getCroppedImg = (image, pixelCrop, fileName) => {

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
  return new Promise((resolve, reject) => {
    canvas.toBlob(file => {
      file.name = fileName;
      resolve(file);
    }, 'image/jpeg');
  });
}

  onImageLoaded = (image) => {
    var splitName = this.state.dataUrl.split('\\').pop().split('/').pop();
    this.setState({
      crop: makeAspectCrop({
        x: 20,
        y: 5,
        aspect: 1,
      }, image.naturalWidth / image.naturalHeight),
      disabled: false,
      image,
      imgName: splitName
    });
  }

  onCropComplete = (crop, pixelCrop) => {
    this.setState({pixelCrop: pixelCrop})

  }

  onCropChange = (crop) => {
    this.setState({ crop });
  }

  render() {
    return (
      <div className="test">
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
          <Button color='green' onClick={this.onYesButtonClick}>Y</Button>
          <Button color='red' onClick={this.onNoButtonClick}>N</Button>
        </div>
      </div>
      </div>
    );
  }
}
