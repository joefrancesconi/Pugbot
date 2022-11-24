const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> just triggered the **show** command!`
});

// Write some custom code here
let results = await lib.airtable.query['@1.0.0'].select({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `game`,
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  }
});

let roles = results.rows.map((row) => {
  return Number(row.fields.role);
});

let team = results.rows.map((row) => {
  return Number(row.fields.team);
});

let player = results.rows.map((row) => {
  return row.fields.player;
});

let out = results.rows.map((row) =>{
  return row.fields.out;
});

// console.log(roles);
// console.log(team);
// console.log(player);

var team1 = new Array;
var rol1 = new Array;
var team2 = new Array;
var rol2 = new Array;
//let it = 0;
for (let i = 0; i < player.length; i++){
  if (team[i] == 1){
    team1.push(player[i]);
    rol1.push(roles[i]);
    //it++;
  }else if (team[i] == 2){
    team2.push(player[i]);
    rol2.push(roles[i]);
    //it++;
  }
  } 
  
// await lib.airtable.query['@1.0.0'].update({
  // baseId: `app47jUZ5IjGJsUwM`,
  // table: `game`,
  // where: [
    // {
      // 'player__is': `${team2[5]}`
    // }
  // ],
  // limit: {
    // 'count': 0,
    // 'offset': 0
  // },
  // fields: {
    // 'team': `${null}`
  // },
  // typecast: true
// });

await lib.airtable.query['@1.0.0'].update({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `game`,
    where: [
      {
        'team__is_null': true
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'out': `${Number(1)}`
    },
    typecast: true
  });
  
await lib.airtable.query['@1.0.0'].update({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `game`,
  where: [
    {
      'team__not_null': true
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
  fields: {
    'out': `${Number(0)}`
  },
  typecast: true
});

 // console.log(team1);
  //console.log(team1[4]); //this pesky fucker=dont know, just removed it from database for now

return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: 
`**Team 1:**
\t<@!${team1[0]}>  ${rol1[0]}
\t<@!${team1[1]}>  ${rol1[1]}
\t<@!${team1[2]}>  ${rol1[2]}
\t<@!${team1[3]}>  ${rol1[3]}
\t<@!${team1[4]}>  ${rol1[4]}
**Team 2:**
\t<@!${team2[0]}>  ${rol2[0]}
\t<@!${team2[1]}>  ${rol2[1]}
\t<@!${team2[2]}>  ${rol2[2]}
\t<@!${team2[3]}>  ${rol2[3]}
\t<@!${team2[4]}>  ${rol2[4]}`
});


