<template>
  <v-container fluid>
    <div
      v-if="fullDisplay"
      class="d-flex flex-row align-center justify-space-around"
    >
      <div class="mx-2 font-weight-light">{{ actuelLevel[0].name }}</div>
      <v-progress-linear
        id="expBar"
        :value="level"
        color="blue"
        height="20"
        rounded
      >
      </v-progress-linear>
      <div class="mx-2 font-weight-light">{{ actuelLevel[1].name }}</div>
    </div>
    <div v-else class="mx-2 font-weight-light">{{ actuelLevel[0].name }}</div>
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
      let result = [];

      for (let index = 0; index < reputationStatus.length; index++) {
        if (exp == reputationStatus[index].objectif) {
          result.push(reputationStatus[index]);
          result.push(reputationStatus[index + 1]);
          return result;
        } else if (
          exp > reputationStatus[index].objectif &&
          exp < reputationStatus[index + 1].objectif
        ) {
          result.push(reputationStatus[index]);
          result.push(reputationStatus[index + 1]);
          return result;
        }
      }
      return result;
    },
    percentage(exp, objectif, previousObjectif) {
      let result;
      let userExp = exp;
      if (userExp > previousObjectif) {
        userExp = userExp - previousObjectif;
        result = (userExp * 100) / objectif;
      }
      // result = (exp * 100) / objectif;
      return result;
    },
    levelColor() {
      let actuelLevel = this.actuelLevel[0].name;
      switch (actuelLevel) {
        case "Nouveau":
          this.$emit("level-color", { color: "#A9A9A9" });
          break;
        case "Débutant":
          this.$emit("level-color", { color: "#09BA00" });
          break;
        case "Amateur":
          this.$emit("level-color", { color: "#0882CB" });
          break;
        case "Confirmé":
          this.$emit("level-color", { color: "#9405E3" });
          break;
        case "Maître":
          this.$emit("level-color", { color: "#FFB700" });
          break;
      }
    },
  },
  created() {
    this.actuelLevel = this.howLevel(this.reputationStatus, this.exp);
    this.level = this.percentage(
      this.exp,
      this.actuelLevel[1].objectif,
      this.actuelLevel[0].objectif
    );
    this.levelColor();
  },
};
</script>

<style scoped></style>
