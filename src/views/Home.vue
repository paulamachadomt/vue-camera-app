<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vue Camera App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false">
      <ion-grid>
        <ion-row>
          <ion-col size="6" :key="photo" v-for="photo in photos">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>
      <!-- <ion-fab> markup  -->
    </ion-content>

    <ion-content :fullscreen="false">
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <ion-button vertical="bottom" horizontal="center"
      >Galeria de Fotos</ion-button
    >
  </ion-page>
</template>

<script lang="ts">
import { camera, trash, close } from 'ionicons/icons';
import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon,
         IonToolbar, IonTitle, IonContent, IonGrid, IonRow,
         IonCol, IonImg } from '@ionic/vue';
//import { defineComponent } from 'vue';
import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';

export default ({
  name: 'Home',
  components: { IonPage, IonHeader, IonFab, IonFabButton, IonIcon,
         IonToolbar, IonTitle, IonContent, IonGrid, IonRow,
         IonCol, IonImg },
         
  setup() {
    const { photos, takePhoto  } = usePhotoGallery();

    return {
      photos,
      takePhoto,
      camera, trash, close
    };
  },
});
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>