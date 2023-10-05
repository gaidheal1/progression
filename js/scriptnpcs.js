

document.addEventListener("DOMContentLoaded", 
  function (event) {

        // Call server to get quest info
      $ajaxUtils
        .sendGetRequest("/data/npc.json",
          function (res) {
            var npc = res.npcs.npc100;
            
            var message = ""
            
            // for (npc in res.npcs) {
            //   message += "<p>" + npc.prefix + " " + npc.name + " is a " + npc.role + " in " + npc.location + "</p>";
            // }

            message += "<p>" + npc.prefix + " " + npc.name + " is a " + npc.role + " in " + npc.location + "</p>";
            // message += "<p>Level " + npc.level + "</p>";
            // message += "<p>Experience: " + npc.xp + "/" + npc.reqXP + "</p>";
            // message += "<p>Health: " + npc.health + "/" + npc.maxHealth + "</p>";
            // message += "<p>Coins: " + npc.coins + "</p>";
            // message += "<p>Location: " + npc.location + "</p>";

            document.querySelector("#npcs")
              .innerHTML = message;
            
          });
        
});
