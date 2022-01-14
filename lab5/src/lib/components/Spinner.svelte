<div class="loader">
  <span />
  <span />
  <span />
  <span />
</div>

<style>
  .loader {
    text-align: center;
  }
  .loader span {
    display: inline-block;
    width: 5px;
    height: 20px;
    background-color: #3498db;
  }

  .loader span:nth-child(1) {
    animation: grow 1s ease-in-out infinite;
  }

  .loader span:nth-child(2) {
    animation: grow 1s ease-in-out 0.15s infinite;
  }

  .loader span:nth-child(3) {
    animation: grow 1s ease-in-out 0.3s infinite;
  }

  .loader span:nth-child(4) {
    animation: grow 1s ease-in-out 0.45s infinite;
  }
  @keyframes grow {
    0%,
    100% {
      -webkit-transform: scaleY(1);
      -ms-transform: scaleY(1);
      -o-transform: scaleY(1);
      transform: scaleY(1);
    }

    50% {
      -webkit-transform: scaleY(1.8);
      -ms-transform: scaleY(1.8);
      -o-transform: scaleY(1.8);
      transform: scaleY(1.8);
    }
  }
</style>
