function main() {
  const teetimes = [
    {
      club: 'Miền Nam',
      'name-golfer': 'Deanna Sawayn',
      type: 'Foursome',
      match_num: 1,
      tee: 1,
      time: '07:00',
    },
    {
      club: 'Miền Nam',
      'name-golfer': 'Bessie Veum',
      type: 'Foursome',
      match_num: 1,
      tee: 1,
      time: '07:00',
    },
    {
      club: 'Miền Nam',
      'name-golfer': 'Jim Heaney',
      type: 'Foursome',
      match_num: 2,
      tee: 1,
      time: '07:10',
    },
    {
      club: 'Miền Nam',
      'name-golfer': 'Vicky Hills',
      type: 'Foursome',
      match_num: 2,
      tee: 1,
      time: '07:10',
    },
    {
      club: 'Miền Nam',
      'name-golfer': 'Lorene Wunsch II',
      type: 'Foursome',
      match_num: 3,
      tee: 1,
      time: '07:20',
    },
    {
      club: 'Miền Nam',
      'name-golfer': 'Clayton Mante',
      type: 'Foursome',
      match_num: 3,
      tee: 1,
      time: '07:20',
    },
    {
      club: 'Miền Nam',
      'name-golfer': 'Lorene Rogahn',
      type: 'Foursome',
      match_num: 4,
      tee: 1,
      time: '07:30',
    },
    {
      club: 'Miền Nam',
      'name-golfer': 'Joyce Kuhn',
      type: 'Foursome',
      match_num: 4,
      tee: 1,
      time: '07:30',
    },
    {
      club: 'Miền Bắc',
      'name-golfer': 'Winston Christiansen',
      type: 'Foursome',
      match_num: 1,
      tee: 1,
      time: '07:00',
    },
    {
      club: 'Miền Bắc',
      'name-golfer': 'Jamie Corwin',
      type: 'Foursome',
      match_num: 1,
      tee: 1,
      time: '07:00',
    },
    {
      club: 'Miền Bắc',
      'name-golfer': 'Hector Greenholt',
      type: 'Foursome',
      match_num: 2,
      tee: 1,
      time: '07:10',
    },
    {
      club: 'Miền Bắc',
      'name-golfer': 'Jan Bode',
      type: 'Foursome',
      match_num: 2,
      tee: 1,
      time: '07:10',
    },
    {
      club: 'Miền Bắc',
      'name-golfer': 'Scott Hane',
      type: 'Foursome',
      match_num: 3,
      tee: 1,
      time: '07:20',
    },
    {
      club: 'Miền Bắc',
      'name-golfer': 'Guy Heaney',
      type: 'Foursome',
      match_num: 3,
      tee: 1,
      time: '07:20',
    },
    {
      club: 'Miền Bắc',
      'name-golfer': 'Muriel Windler',
      type: 'Foursome',
      match_num: 4,
      tee: 1,
      time: '07:30',
    },
    {
      club: 'Miền Bắc',
      'name-golfer': 'Ralph Bergnaum',
      type: 'Foursome',
      match_num: 4,
      tee: 1,
      time: '07:30',
    },
  ];
  const teamVersus = [];
  const matches = [1, 2, 3, 4];
  for (let i = 0; i < matches.length; i++) {
    let teams = [];
    for (let j = 0; j < teetimes.length; j++) {
      if (teetimes[j]['match_num'] === matches[i]) teams.push(teetimes[j]);
    }
    let hostTeam = teams.shift();

    const guestTeam = teams.filter((t) => t.club !== hostTeam.club);
    hostTeam = [hostTeam, teams.find((t) => t.club === hostTeam.club)];
    console.log({ hostTeam });
    console.log({ guestTeam });
    teamVersus.push([hostTeam, guestTeam]);
  }
  console.log(teamVersus);
}
console.log(main());
