<script>
  import { popupMsg } from '../store.js';
  export function close() {
    popupMsg.set('');
  }
</script>

<div class="popup">
  <h2>Caution</h2>
  <p>{$popupMsg}</p>
  <div on:click={() => close()}>&times;</div>
</div>

<style>
  .popup {
    display: block;
    width: 200px;
    padding: 15px 40px;
    background-color: #2e2e2e;
    color: #fff;
    border: 2px solid #ff0000;
    border-radius: 5px;
    position: fixed;
    right: 20px;
    bottom: 20px;
    font-size: 0.8em;
  }
  p{
    text-align: center;
  }
  h2 {
    text-align: center;
  }
  .popup div {
    text-align: center;
    font-size: 1.5em;
    line-height: 25px;
    position: absolute;
    width: 25px;
    height: 25px;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
</style>
