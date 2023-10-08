

document.addEventListener("DOMContentLoaded", 
  function (event) {

        // Call server to get quest info
      $ajaxUtils
        .sendGetRequest("/data/npc.json",
          function (res) {
            // var npc = res.npcs[0];
            // console.log(npc.id);
            var message = "";
            var npc;
            // message += "<p>" + npc.prefix + " " + npc.name + " is a " + npc.role + " in " + npc.location + "</p>";
            for (var i = 0; i < res.length; i++) {
              npc = res[i]
              message += "<p>" + npc.prefix + " " + npc.name + " is a " + npc.role + " in " + npc.location + "</p>";
            }
            console.log(res[0].id);
            
            // message += "<p>Level " + npc.level + "</p>";
            // message += "<p>Experience: " + npc.xp + "/" + npc.reqXP + "</p>";
            // message += "<p>Health: " + npc.health + "/" + npc.maxHealth + "</p>";
            // message += "<p>Coins: " + npc.coins + "</p>";
            // message += "<p>Location: " + npc.location + "</p>";

            document.querySelector("#npcs")
              .innerHTML = message;
            
          });
        
});
