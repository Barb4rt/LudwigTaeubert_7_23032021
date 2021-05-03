<template>
  <v-container fluid>
    <div
      v-if="fullDisplay"
      class="d-flex flex-row align-center justify-space-around"
    >
      <div class="mx-2">{{ actuelLevel[0].name }}</div>
      <v-progress-linear
        id="expBar"
        :value="level"
        color="blue"
        height="20"
        rounded
      >
      </v-progress-linear>
      <div class="mx-2">{{ actuelLevel[1].name }}</div>
    </div>
    <div v-else class="mx-2">{{ actuelLevel[0].name }}</div>
  </v-container>
</template>

<script>
export default {
  name: "ExpBar",
  props: {
    exp: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    fullDisplay: {
      Boolean,
      default: () => {
        return true;
      },
    },
  },
  data() {     
    return {
      reputationStatus: [
        { name: "Nouveau", objectif: 0 },
        { name: "Débutant", objectif: 100 },
        { name: "Amateur", objectif: 300 },
        { name: "Confirmé", objectif: 900 },
        { name: "Maître", objectif: 2700 },
      ],
      actuelLevel: null,
      level: null,
    };
  },
  computed: {},
  methods: {
    howLevel(reputationStatus, exp) {
      console.log(reputationStatus);
      let result = [];
      for (let index = 0; index < reputationStatus.length; index++) {
        if (
          exp >= reputationStatus[index].objectif &&
          exp <= reputationStatus[index + 1].objectif
        ) {
          result.push(reputationStatus[index]);
          result.push(reputationStatus[index + 1]);
          return result;
        }
      }
      return result;
    },
    percentage(exp, objectif) {
      let result = (exp * 100) / objectif;
      return result;
    },
  },
  created() {
    this.actuelLevel = this.howLevel(this.reputationStatus, this.exp);
    this.level = this.percentage(this.exp, this.actuelLevel[1].objectif);
  },
};
</script>

<style scoped></style>
