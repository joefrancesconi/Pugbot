const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> just triggered the **gameresult** command!`
});

// WORKS POG
// context.params.event.data.options[0].value
let results = await lib.airtable.query['@1.0.0'].select({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `game`,
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  }
});

let r = await lib.airtable.query['@1.0.0'].select({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `data`,
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  }
});

let team = results.rows.map((row) => {
  return Number(row.fields.team);
});

let player = results.rows.map((row) => {
  return row.fields.player;
});

let total = r.rows.map((row) => {
  return Number(row.fields.total);
});

let won = r.rows.map((row) => {
  return Number(row.fields.won);
});

var team1 = new Array;
var team2 = new Array;
//let it = 0;
for (let i = 0; i < player.length; i++){
  if (team[i] == 1){
    team1.push(player[i]);
  }else if (team[i] == 2){
    team2.push(player[i]);
  }
  } 

for (let i = 0; i < team1.length; i++){
  let tot = await lib.airtable.query['@1.0.0'].distinct({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `data`,
    where: [
      {
        'player__is': `${team1[i]}`
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    field: `total`
  });
  //console.log(tot.distinct.values[0]);
  await lib.airtable.query['@1.0.0'].update({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `data`,
    where: [
      {
        'player__is': `${team1[i]}`
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'total': `${Number(tot.distinct.values[0])+1}`
    },
    typecast: true
  });
  //team 2
  let tot1 = await lib.airtable.query['@1.0.0'].distinct({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `data`,
    where: [
      {
        'player__is': `${team2[i]}`
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    field: `total`
  });
  await lib.airtable.query['@1.0.0'].update({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `data`,
    where: [
      {
        'player__is': `${team2[i]}`
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'total': `${Number(tot1.distinct.values[0])+1}`
    },
    typecast: true
  });
}

if (context.params.event.data.options[0].value){
  for (let i = 0; i < team1.length; i++){
    let w = await lib.airtable.query['@1.0.0'].distinct({
      baseId: `app47jUZ5IjGJsUwM`,
      table: `data`,
      where: [
        {
          'player__is': `${team1[i]}`
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
      field: `won`
    });
    await lib.airtable.query['@1.0.0'].update({
      baseId: `app47jUZ5IjGJsUwM`,
      table: `data`,
      where: [
        {
          'player__is': `${team1[i]}`
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
      fields: {
        'won': `${Number(w.distinct.values[0])+1}` //wont work, not the same iterator
      },
      typecast: true
    });
  }
}else{
  for (let i = 0; i < team2.length; i++){
    let w = await lib.airtable.query['@1.0.0'].distinct({
      baseId: `app47jUZ5IjGJsUwM`,
      table: `data`,
      where: [
        {
          'player__is': `${team2[i]}`
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
      field: `won`
    });
    await lib.airtable.query['@1.0.0'].update({
      baseId: `app47jUZ5IjGJsUwM`,
      table: `data`,
      where: [
        {
          'player__is': `${team2[i]}`
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
      fields: {
        'won': `${Number(w.distinct.values[0])+1}` //wont work, not the same iterator
      },
      typecast: true
    });
  }
}
