<template>
  <div class="event-card">
    <h4>{{ event.username }}</h4>
    <br />
    <h5>{{ event.title }}</h5>
    <br />
    <p>{{ event.content }}</p>
    <img :src="event.attachment" />
    <button @click="deleteEvent" v-show="isUser">Supprimer le message</button>
    <button @click="deleteEvent" v-show="isUser">Modifier le message</button>
    <p>{{ event.id }}</p>
    <span>@{{ event.updatedAt }}</span>
  </div>
</template>

<script>
export default {
  name: "EventCard",
  props: {
    event: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isUser: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  methods: {
    deleteEvent() {
      this.$emit("deleteEvent", this.event.id);
    },
  },
};
</script>

<style scoped>
.event-card {
  width: 13em;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  transition: all 0.2s linear;
}
.event-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.event-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
</style>
