import TournamentSchema from "@/models/schemas/TournamentSchema";
import Team from "@/models/Team";
import Player from "@/models/Player";
import Category from "@/models/Category";
import CategoryGroup from "@/models/CategoryGroup";
import Sports from "@/models/Sports";

import lodash from 'lodash';

const PRYVYD_ID = "pryvyd";

const getById = async function (id) {
  let tournament = await TournamentSchema.findById(id);
  //const teams = await Team.getTeamsByIds(tournament.teams || []);
  //const players = await Player.getPlayers(tournament.players || []);
  
  //tournament.teams = teams;
  //tournament.players = players;
  tournament.categories = tournament.categories || [];
  for(const categoryIdx in tournament.categories) {
    tournament.categories[categoryIdx] = new Category(tournament.categories[categoryIdx]);
    //tournament.categories[categoryIdx].playersList = [];
    /*if (Array.isArray(tournament.categories[categoryIdx].players)) {
      let players = await Player.getPlayers(tournament.categories[categoryIdx].players);
      tournament.categories[categoryIdx].playersList = players;
    }*/
  }

  return tournament;
}

const getUserTournament = async function (id, user_id) {
  let tournament = await TournamentSchema.findOne({ _id: id, user_id: user_id });
  
  tournament.categories = tournament.categories || [];
  for(const categoryIdx in tournament.categories) {
    tournament.categories[categoryIdx] = new Category(tournament.categories[categoryIdx]);
  }

  return tournament;
}

const getFullTournamentInfo = async function (id, user_id) {
  let searchParams = { _id: id };
  if (user_id) {
    searchParams.user_id = user_id;
  }
  let tournament = await TournamentSchema.findOne(searchParams);
  if (!tournament) {
    return {
      tournament: {},
      players: [],
      teams: [],
      playersByCategory: [],
      playersByTeam: []
    };
  }
  let teamIds = tournament.teams || [];
  const players = await Player.getPlayers(tournament.players || []);
  players.forEach(player => {
    if (player.team_id && !teamIds.includes(player.team_id)) {
      teamIds.push(player.team_id);
    }
  });
  
  tournament.categories = tournament.categories || [];

  tournament.categories.forEach((category, idx) => {
    tournament.categories[idx] = new Category(category);
    if (category.type === "group") {
      category.players.forEach(team_id => {
        if (!teamIds.includes(team_id)) {
          teamIds.push(team_id);
        }
      });
    }
  });
  const teams = await Team.getTeamsByIds(teamIds);
  let playersByCategory = {};
  /*for(const category of tournament.categories) {
    playersByCategory[category.id] = category.type === "individual" ? await Player.getPlayers(category.players || []) : await Team.getTeamsByIds(category.players || []);
  }*/
  for(const category of tournament.categories) {
    let categoryPlayers = category.type === "individual" ? await Player.getPlayers(category.players || []) : await Team.getTeamsByIds(category.players || []);
    playersByCategory[category.id] = [];
    if (category.type === "individual") {
      teams.forEach(team => {
        let teamPlayers = categoryPlayers.filter(player => {
          return player.team_id === team._id.toString();
        }).map(player => {
          player.team = team;
          return player;
        });
        if (teamPlayers.length > 0) {
          playersByCategory[category.id].push({
            team: team,
            players: teamPlayers
          });
        }
      });
      let noTeamCategoryPlayers = categoryPlayers.filter(player => {
        return !player.team_id;
      });
      if (noTeamCategoryPlayers.length > 0) {
        playersByCategory[category.id].push({
          team: { title: "" },
          players: noTeamCategoryPlayers.map(player => {
            player.team = {};
            return player;
          })
        });
      }
    } else {
      playersByCategory[category.id].push({
        team: {},
        players: categoryPlayers
      });
    }
  }
  let playersByTeam = [];
  teams.forEach(team => {
    let teamPlayers = players.filter(player => {
      return player.team_id === team._id.toString();
    });
    playersByTeam.push({
      team: team,
      players: teamPlayers
    });
  });
  playersByTeam = playersByTeam.filter(team => {
    return team.players.length > 0;
  });
  let noTeamPlayers = players.filter(player => {
    return !player.team_id;
  });
  if (noTeamPlayers.length > 0) {
    playersByTeam.push({
      team: { title: "" },
      players: noTeamPlayers
    });
  }

  return {
    tournament: tournament,
    players: players,
    teams: teams,
    playersByCategory: playersByCategory,
    playersByTeam: playersByTeam
  };
}

const getAll = async function () {
  let tournaments = await TournamentSchema.find({});
  tournaments.forEach(tournament => {
    tournament.categories = tournament.categories || [];
    tournament.categories.forEach((category, categoryIdx) => {
      tournament.categories[categoryIdx] = new Category(category);
    });
  });
  return tournaments;
}

const getUserTournaments = async function (user_id) {
  /*let teams = await Team.getAllTeams();
  for (const team of teams) {
    let idx = 1;
    let players = await Player.filter([
      {
        field: "team_id",
        value: team._id,
        compare: "="
      }
    ]);
    for (const player of players) {
      await Player.update(player._id, { index: idx++ });
    }
  }*/
  let tournaments = await TournamentSchema.find({ user_id: user_id });
  tournaments.forEach(tournament => {
    tournament.categories = tournament.categories || [];
    tournament.categories.forEach((category, categoryIdx) => {
      tournament.categories[categoryIdx] = new Category(category);
    });
  });
  return tournaments;
}

const create = async function (params) {
  return await TournamentSchema.create(params);
}

const update = async function (id, update) {
  if (Array.isArray(update.categories)) {
    update.categories.forEach((category, categoryIdx) => {
      delete update.categories[categoryIdx].playersList;
      update.categories[categoryIdx] = new Category(category);
    });
  }
  return await TournamentSchema.updateOne({ _id: id }, update);
}

const getTournamentTeams = async function (tournamentId) {}

const draw = async function (tournament_id, category_id) {
  const tournament = await getFullTournamentInfo(tournament_id);
  let categoryIdx = tournament.tournament.categories.findIndex(cat => {
    return cat.id === category_id;
  });
  const category = tournament.tournament.categories[categoryIdx];
  if (category) {
    if (category.hasGroups) {
      return drawGroups(tournament_id, category_id);
    }
    let participants = category.players;
    if (Array.isArray(participants) && participants.length > 0) {
      participants = participants.slice();
      let rounds = 1;
      let foundRounds = false;
      do {
        if (rounds * 2 >= participants.length) {
          foundRounds = true;
        } else {
          rounds*= 2;
        }
      } while (!foundRounds);
      let hasPryvyd = participants.length < rounds * 2;
      while (participants.length < rounds * 2) {
        participants.push(PRYVYD_ID);
      }
      let drawRounds = [];
      let drawRound = {
        round: rounds,
        games: []
      };
      let seedPlayers = category.seeds && Array.isArray(category.seedPlayers) ? category.seedPlayers.slice() : [];
      if (seedPlayers.length > 0) {
        let seeds = participants.filter(participant_id => {
          return seedPlayers.includes(participant_id);
        });
        let nonSeeds = participants.filter(participant_id => {
          return !seedPlayers.includes(participant_id);
        });
        console.log(seeds.length, nonSeeds.length);
        let seedsGames = Math.ceil(rounds / seeds.length);
        while (seeds.length > 0 || nonSeeds.length > 0) {
          let playerFirstIdx = null;
          let participantFirst = null;
          if (seeds.length > 0 && (drawRound.games.length % seedsGames == 0/* || drawRound.games.length >= rounds / 2*/)) {
            playerFirstIdx = getRandom(0, seeds.length - 1);
            participantFirst = seeds.splice(playerFirstIdx, 1)[0];
          } else {
            playerFirstIdx = getRandom(0, nonSeeds.length - 1);
            participantFirst = nonSeeds.splice(playerFirstIdx, 1)[0];
          }
          let playerSecondIdx = null;
          let pryvydCount = nonSeeds.filter(participant => {
            return participant === PRYVYD_ID;
          }).length;
          if (participantFirst !== PRYVYD_ID && pryvydCount >= (seeds.length + nonSeeds.length) / 2) {
            playerSecondIdx = nonSeeds.findIndex(participant => {
              return participant === PRYVYD_ID;
            });
          } else {
            if (participantFirst === PRYVYD_ID) {
              playerSecondIdx = nonSeeds.findIndex(participant => {
                return participant !== PRYVYD_ID;
              });
            } else {
              playerSecondIdx = getRandom(0, nonSeeds.length - 1);
            }
          };
          let participantSecond = nonSeeds.splice(playerSecondIdx, 1)[0];
          console.log(seeds.length, nonSeeds.length);
          drawRound.games.push({
            red: participantFirst,
            white: participantSecond
          });
        }
      } else {
        console.log("NO SEEDS", rounds, participants.length, category.players.length);
        while (participants.length > 0) {
          let playerFirstIdx = getRandom(0, participants.length - 1);
          let participantFirst = participants.splice(playerFirstIdx, 1)[0];
          let playerSecondIdx = null;
          let pryvydCount = participants.filter(participant => {
            return participant === PRYVYD_ID;
          }).length;
          if (participantFirst !== PRYVYD_ID && pryvydCount >= participants.length / 2) {
            playerSecondIdx = participants.findIndex(participant => {
              return participant === PRYVYD_ID;
            });
          } else {
            if (participantFirst === PRYVYD_ID) {
              playerSecondIdx = participants.findIndex(participant => {
                return participant !== PRYVYD_ID;
              });
            } else {
              playerSecondIdx = getRandom(0, participants.length - 1);
            }
          };
          let participantSecond = participants.splice(playerSecondIdx, 1)[0];
          drawRound.games.push({
            red: participantFirst,
            white: participantSecond
          });
        }
      }
      drawRounds.push(drawRound);
      if (hasPryvyd) {
        let nextRound = {
          round: drawRound.round / 2,
          games: []
        };
        for (let i = 0; i < drawRound.games.length; i+= 2) {
          let redFirst = drawRound.games[i].red;
          let whiteFirst = drawRound.games[i].white;
          let redSecond = drawRound.games[i + 1].red;
          let whiteSecond = drawRound.games[i + 1].white;
          let nextGame = { red: "", white: "" };
          if (redFirst === PRYVYD_ID || whiteFirst === PRYVYD_ID || redSecond === PRYVYD_ID || whiteSecond === PRYVYD_ID) {
            if (redFirst === PRYVYD_ID && whiteFirst !== PRYVYD_ID) {
              nextGame.red = whiteFirst;
            } else if (redFirst !== PRYVYD_ID && whiteFirst === PRYVYD_ID) {
              nextGame.red = redFirst;
            }
            if (redSecond === PRYVYD_ID && whiteSecond !== PRYVYD_ID) {
              nextGame.white = whiteSecond;
            } else if (redSecond !== PRYVYD_ID && whiteSecond === PRYVYD_ID) {
              nextGame.white = redSecond;
            }
          }
          nextRound.games.push(nextGame);
        }
        drawRounds.push(nextRound);
      }
      let categoryDraw = {
        totalRounds: getRoundsCount(drawRound.games.length),
        games: drawRounds
      };

      category.draw = categoryDraw;
      tournament.tournament.categories[categoryIdx] = category;

      console.log(JSON.stringify(category.draw));
      await update(tournament_id, tournament.tournament);
    }
  }

  return await getFullTournamentInfo(tournament_id);
}

const drawGroups = async function (tournament_id, category_id) {
  const tournament = await getFullTournamentInfo(tournament_id);
  let categoryIdx = tournament.tournament.categories.findIndex(cat => {
    return cat.id === category_id;
  });
  const category = tournament.tournament.categories[categoryIdx];
  if (category && category.groupsData.groupsCount > 0 && category.drawBaskets.length > 0) {
    const participantsList = category.type === "group" ? await Team.getTeamsByIds(category.players) : await Player.getPlayersByIds(category.players);
    let drawBaskets = lodash.cloneDeep(category.drawBaskets);
    category.groups = [];
    for (let i = 0; i < category.groupsData.groupsCount; ++i) {
      let group = new CategoryGroup({index: i});
      let basketIdx = 0;
      while (group.players.length < category.groupsData.groupSize) {
        if (drawBaskets[basketIdx]) {
          if (drawBaskets[basketIdx].length > 0) {
            const playerIndex = getRandomInt(0, drawBaskets[basketIdx].length - 1);
            const playerId = drawBaskets[basketIdx].splice(playerIndex, 1)[0];
            const player = participantsList.find(pl => {
              return pl._id.toString() === playerId;
            })
            group.players.push(player);
          }
          ++basketIdx;
        } else {
          basketIdx = 0;
        }
        let hasPlayers = drawBaskets.find(basket => {
          return basket.length > 0;
        });
        if (!hasPlayers) {
          break;
        }
      }
      category.groups.push(group);
    }
    tournament.tournament.categories[categoryIdx] = category;
    await update(tournament_id, tournament.tournament);
  }
  return await getFullTournamentInfo(tournament_id);
}

const saveGameResult = async function (tournament_id, category_id, result, groupIdx = null) {
  const sports = await Sports.getAll();
  const tournament = await getById(tournament_id);
  const categoryIdx = tournament.categories.findIndex(cat => {
    return cat.id === category_id;
  });

  if (categoryIdx !== -1) {
    let category = tournament.categories[categoryIdx];
    const sport = sports.find(sp => {
      return sp._id.toString() === category.sport;
    });
    
    if (sport) {
      switch (sport.name) {
        case "football":
          if (groupIdx !== null) {
            let group = category.groups[groupIdx];
            let resultIdx = group.results.findIndex(res => {
              return res.playerA === result.playerA && res.playerB === result.playerB;
            });
            if (resultIdx !== -1) {
              group.results[resultIdx] = result;
            } else {
              group.results.push(result);
            }
            [result.playerA, result.playerB].forEach(player_id => {
              let scored = 0;
              let missed = 0;
              let points = 0;
              group.results.forEach(res => {
                if (res.playerA === player_id) {
                  scored+= res.resultA;
                  missed+= res.resultB;
                  points+= (res.resultA > res.resultB ? 3 : (res.resultA === res.resultB ? 1 : 0));
                } else if (res.playerB === player_id) {
                  scored+= res.resultB;
                  missed+= res.resultA;
                  points+= (res.resultA < res.resultB ? 3 : (res.resultA === res.resultB ? 1 : 0));
                }
              });
              group.positions[player_id] = {
                points: points,
                scored: scored,
                missed: missed,
                diff: scored - missed
              };
            });
            category.groups[groupIdx] = new CategoryGroup(group);
            tournament.categories[categoryIdx] = new Category(category);
            console.log(await update(tournament_id, { $set: { categories: tournament.categories } }));
          }
          break;
      }
    }
  }
  return await getFullTournamentInfo(tournament_id);
}

const getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
}

const getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRoundsCount = function (games) {
  return Math.log(games) / Math.log(2) + 1;
}

export default {
  getById,
  getAll,
  create,
  update,
  getFullTournamentInfo,
  draw,
  getUserTournament,
  getUserTournaments,
  saveGameResult
}