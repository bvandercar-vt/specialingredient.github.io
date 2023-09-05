import { getPlaylist } from './src/spotify'

console.log('SANDBOX')

getPlaylist('11LQg5DzHBn6udibRdhfU6').then((pl) => console.log(pl))
