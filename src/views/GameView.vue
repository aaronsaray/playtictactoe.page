<template>
  <div>
    <participant-info :players="players" :x-active="xActive"></participant-info>
    <game-board></game-board>
    <start-game v-if="!gameType" :join-game-id="gameId" @start-game="startGame"></start-game>
    <waiting-on-player-2 v-if="waitingOnPlayer2" :game-id="gameId"></waiting-on-player-2>
  </div>
</template>

<script>
import { GAME_TYPE_2_PLAYER } from "@/GameTypes";
import GameBoard from "../components/GameBoard.vue";
import ParticipantInfo from "../components/ParticipantInfo.vue";
import StartGame from "../components/StartGame/StartGame.vue";
import WaitingOnPlayer2 from "../components/WaitingOnPlayer2.vue";

export default {
  components: {
    "game-board": GameBoard,
    "start-game": StartGame,
    "participant-info": ParticipantInfo,
    WaitingOnPlayer2,
  },

  created() {
    this.gameId = this.$route.params.game_id;
  },

  data() {
    return {
      gameId: null,

      gameType: null,

      xActive: true,

      players: {
        x: {
          name: "Player 1",
          wins: 0,
          losses: 0,
          ties: 0,
          userId: null,
        },
        o: {
          name: "Player 2",
          wins: 0,
          losses: 0,
          ties: 0,
          userId: null,
        },
      },
    };
  },

  computed: {
    waitingOnPlayer2() {
      return this.gameType === GAME_TYPE_2_PLAYER && this.players.o.userId === null;
    },
  },

  methods: {
    startGame(gameDetails) {
      this.gameType = gameDetails.type;

      if (this.gameType !== GAME_TYPE_2_PLAYER) {
        // 1 player easy or hard
        this.players.x.name = gameDetails.playerName;
        this.players.o.name = "Computer";
      } else if (this.gameId) {
        // 2 player, joining
        this.players.o.name = gameDetails.playerName;
        this.players.o.userId = gameDetails.userId;
      } else {
        // 2 player, creating
        this.players.x.name = gameDetails.playerName;
        this.players.x.userId = gameDetails.userId;
        this.gameId = gameDetails.gameId;
      }
    },
  },
};
</script>

<style lang="scss">
#start-game,
#waiting-on-player-2 {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding-top: 5rem;
}
</style>
