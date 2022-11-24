const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `**Building Teams . . .**`
});

// Write some custom code here
let players = await lib.airtable.query['@1.0.0'].count({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `game`,
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  }
});

//get roles
let results = await lib.airtable.query['@1.0.0'].select({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `game`,
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  }
});

await lib.airtable.query['@1.0.0'].update({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `game`,
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  },
  fields: {
    'team': `${null}`
  },
  typecast: true
});

let roles = results.rows.map((row) => {
  return row.fields.role;
});

let scores = results.rows.map((row) =>{
  return row.fields.score;
});

let out = results.rows.map((row) =>{
  return row.fields.out;
});
//if exactly 10 no one has to worry about sitting out (also fucks up shit if not here)
if (players.count == 10) {
  await lib.airtable.query['@1.0.0'].update({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `game`,
    where: [{}],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'out': `${Number(0)}`
    },
    typecast: true
  });
}
if (players.count >= 10){
  var arrscores = new Array(10);
  var tank = new Array;
  var dps = new Array;
  var sup = new Array;
  //console.log(tank.length);               //
  let vT = 0, vD = 0, vS = 0;
  //first run, those who sat out
  for (let i = 0; i < roles.length; i++){
    //search here
    if (Number(roles[i]) == 1 && (Number(out[i]) === 1)){
      //tank[j] = ps.distinct.values[i];
      //tank[j].concat(ps.distinct.values[i]);
      //console.log('Length: ' + tank.length);
      //console.log('out: ' + out[i]);
      
      vT++;
      if (tank.length < 2){ tank.push(Number(scores[i])); }
      //console.log(scores[i]);
    }
    else if (Number(roles[i]) == 2 && (Number(out[i]) === 1)){
      //dps[k].concat(ps.distinct.values[i]);
      vD++;
      if (dps.length < 4){ dps.push(Number(scores[i])); }
      //console.log(scores[i]);
    }
    else if (Number(roles[i]) == 3 && (Number(out[i]) === 1)){
      //sup[l].concat(ps.distinct.values[i]);
      vS++;
      if (sup.length < 4){ sup.push(Number(scores[i])); }
      //console.log(scores[i]);
    }
  }
  //flex those who sat
  for (let i = 0; i < roles.length; i++){
    if (Number(roles[i]) == 4 && (Number(out[i]) === 1)){
      if (tank.length < 2){ tank.push(Number(scores[i])); }
      else if (dps.length < 4){ dps.push(Number(scores[i])); }
      else if (sup.length < 4){ sup.push(Number(scores[i])); }
    }
  }
  //second run, those who already played
  for (let i = 0; i < roles.length; i++){
    //search here
    if (Number(roles[i]) == 1 && (Number(out[i]) != 1)){
      //tank[j] = ps.distinct.values[i];
      //tank[j].concat(ps.distinct.values[i]);
      vT++;
      //console.log('LengthC: ' + tank.length);
      if (tank.length < 2){ tank.push(Number(scores[i])); }
      //console.log(scores[i]);
    }
    else if (Number(roles[i]) == 2 && (Number(out[i]) != 1)){
      //dps[k].concat(ps.distinct.values[i]);
      vD++;
      if (dps.length < 4){ dps.push(Number(scores[i])); }
      //console.log(scores[i]);
    }
    else if (Number(roles[i]) == 3 && (Number(out[i]) != 1)){
      //sup[l].concat(ps.distinct.values[i]);
      vS++;
      if (sup.length < 4){ sup.push(Number(scores[i])); }
      //console.log(scores[i]);
    }
  }
  //flex played
  for (let i = 0; i < roles.length; i++){
    if (Number(roles[i]) == 4 && (Number(out[i]) != 1)){
      if (tank.length < 2){ tank.push(Number(scores[i])); }
      else if (dps.length < 4){ dps.push(Number(scores[i])); }
      else if (sup.length < 4){ sup.push(Number(scores[i])); }
    }
  }
  if ((Number(tank.length) < 2) || (Number(dps.length) < 4) || (Number(sup.length) < 4)){ 
    return lib.discord.channels['@0.3.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `Not enough roles to fill teams. Please try again. 
      Data: (if you are already flexing, no need to change :))
      # of Tanks: ${vT}
      # of DPS: ${vD}
      # of Supports: ${vS}`
    });
  }
  //console.log('TANK FINAL SIZE: ' + tank.length + ' ' + tank[0] + ' ' + tank[1] + ' ' + tank[3]);
  tank.sort(function(a, b){return b - a});
  //console.log('TANK Sort SIZE: ' + tank.length + ' ' + tank[0] + ' ' + tank[1] + ' ' + tank[3]);
  dps.sort(function(a, b){return b - a});
  sup.sort(function(a, b){return b - a});

  arrscores = tank.concat(dps, sup);
  console.log('all SCORES ' + arrscores);

  //console.log(arrscores);
  let ite = 0, teamIt = 1;
  while (ite < 10){
    await lib.airtable.query['@1.0.0'].update({
      baseId: `app47jUZ5IjGJsUwM`,
      table: `game`,
      where: [
        {
          'score__is': `${Number(arrscores[ite])}`
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
      fields: {
        'team': `${Number(teamIt)}`
      },
      typecast: true
    });
    ite++;
    if (teamIt == 1){
      teamIt = 2;
    }else{
      teamIt = 1;
    }
}  
return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `Teams Built. Please run **/show** to Print the teams.`
});

}else if (players.count < 10){
  return lib.discord.channels['@0.3.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `Not enough players! Please add **${10 - players.count}** more players.`
  });
}else{
  return lib.discord.channels['@0.3.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `Not enough roles to fill teams. Please try again.`
  });
}