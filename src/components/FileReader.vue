<template>
  <label class="text-reader">
    Read File
    <input type="file" @change="loadTextFromFile" />
  </label>
</template>

<script>
export default {
  name: "FileReader",
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => this.$emit("load", e.target.result);
      reader.readAsText(file);
    },
  },
};
</script>
<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  color: #cfffb3;
  border-color: #cfffb3;
  border: 2px solid black;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;

  border-color: #cfffb3;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
