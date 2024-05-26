import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as 'photo',
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage.uri || null);
        setPrediction(null);
      }
    });
  };

  const takePicture = () => {
    const options = {
      mediaType: 'photo' as 'photo',
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const capturedImage = response.assets[0];
        setImage(capturedImage.uri || null);
        setPrediction(null);
      }
    });
  };

  const predictImage = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpg',
      });
  
      try {
        const response = await fetch('http://192.168.1.117:6000/predictTumor', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setPrediction(data.prediction);
        } else {
          console.error('Prediction failed:', response.status);
        }
      } catch (error) {
        console.error('Error predicting image:', error);
      }
    }
  };
  
  const clearImage = () => {
    setImage(null);
    setPrediction(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brain Tumor Detection</Text>
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>Take a picture</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image from gallery</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <TouchableOpacity style={styles.button} onPress={predictImage}>
        <Text style={styles.buttonText}>Predict Image</Text>
      </TouchableOpacity>}
      {prediction && <Text style={styles.prediction}>Prediction: <Text style={styles.predictionText}>{prediction}</Text></Text>}
      {image && <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3f51b5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  prediction: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  predictionText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ffeb3b', // Yellow color for prediction text
  },
  clearButton: {
    backgroundColor: '#f44336', // Red color for clear button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '25%'
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;