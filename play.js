const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> just triggered the **play** command!`
});

// Write some custom code here
let uID = context.params.event.member.user.id;

let r = await lib.airtable.query['@1.0.0'].distinct({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `data`,
  where: [
    {
      'player__is': `${context.params.event.member.user.id}`
    }
  ],
  limit: {
    'count': 1,
    'offset': 0
  },
  field: `player`
});
if (r.distinct.values[0] === uID){
  
  let score = await lib.airtable.query['@1.0.0'].distinct({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `data`,
    where: [
      {
        'player__is': `${context.params.event.member.user.id}`
      }
    ],
    limit: {
      'count': 1,
      'offset': 0
    },
    field: `score`
  });
  

  let s = score.distinct.values[0];
  
  let g = await lib.airtable.query['@1.0.0'].distinct({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `game`,
    where: [
      {
        'player__is': `${context.params.event.member.user.id}`
      }
    ],
    limit: {
      'count': 1,
      'offset': 0
    },
    field: `player`
  });
  
  
if (g.distinct.values[0] === uID){
  let check = await lib.airtable.query['@1.0.0'].update({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `game`,
    where: [
      {
        'player__is': `${context.params.event.member.user.id}`
      }
    ],
    limit: {
      'count': 1,
      'offset': 0
    },
    fields: {
      'role': `${context.params.event.data.options[0].value}`
    },
    typecast: true
  });
}else{
  await lib.airtable.query['@1.0.0'].insert({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `game`,
    fieldsets: [
      {
        'player': `${context.params.event.member.user.id}`,
        'score': `${s}`,
        'role': `${context.params.event.data.options[0].value}`
      }
    ],
    typecast: true
  });
}
  
}else{
  return lib.discord.channels['@0.3.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `User not registered. Please regerster with /addusr`
  });
}

