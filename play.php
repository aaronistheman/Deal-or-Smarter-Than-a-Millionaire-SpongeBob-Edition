<!doctype html>
<html lang="en">
<head>

<!--
    Author: Aaron Kaloti
    Release number: 0.1
-->

<meta charset="utf-8" />
<title>Game Show Fusion</title>

<script
    src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js">
</script>
<link rel="stylesheet" type="text/css" href="css/game-show-fusion.css" />

</head>
<body>

<div id="game">
    
    <section id="choose-scene" class="scene">
        <canvas id="choose-background-canvas" width="768" height="440">
        </canvas>
        
        <canvas id="choose-canvas" width="768" height="440"></canvas>
    </section>
    
    <section id="questioning-scene" class="scene">
        <canvas id="questioning-background-canvas"
          width="768" height="440">
        </canvas>
        
        <canvas id="questioning-canvas" width="768" height="440">
        </canvas>
    </section>
    
    <!-- open case scene -->
    <!-- banker deal scene -->
</div>

<script src="js/play.js"></script>
</body>
</html>