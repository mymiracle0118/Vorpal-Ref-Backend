import { objectMapInfo } from "./gameplay";

export enum PackTitle {
    ping = 'ping',
    pong = 'pong',
    auth = 'auth',
    event = 'event',
    unauth = 'unauth',
    startmoving = 'startmoving',
    stopmoving = 'stopmoving',
    entergame = 'entergame',
    withdrawgame = 'withdrawgame',
    exitgame = 'exitgame',
    leftclick = 'leftclick',
    rightclick = 'rightclick',
    keypress = 'keypress',
    gamestart = 'gamestart',
    gameend = 'gameend',
    gamefinish = 'gamefinish',
    globaldataupdate = 'globaldataupdate',
    objectcreate = 'objectcreate',
    objectupdate = 'objectupdate',
    objectList = 'objectlist',
    objectdestroy = 'objectdestroy',
    playerPosition = 'playerPosition',
    buyitem = 'buyitem',
    buyreport = 'buyreport',
    log = 'log'
}

export enum Classes {
    star = 'star',
    planet = 'planet',
    ship = 'ship',
    battleship = 'battleship',
    shell = 'shell'
}

export type Basic = {
    action: PackTitle;
    state: string;
    owner: string;
    objectId: string;
    data: any;
};

export type State = {
    action: PackTitle;
    state: string;
};

export type Data = {
    action: PackTitle;
    data: any;
};

export type AuthEntry = {
    action: PackTitle;
    signature: string;
};

export type AuthReply = {
    action: PackTitle;
    state: string;
    playerId: string;
};

export type AuthReject = {
    action: PackTitle;
    message: string;
};

export type RoomUpd = {
    action: PackTitle;
};

export type MouseMsg = {
    action: PackTitle;
    coords: number[];
    objectId: string;
};

export type KeyboardMsg = {
    action: PackTitle;
    key: string;
};

export type GameStart = {
    action: PackTitle;
    opponent: string;
};

export type GameFinish = {
    action: PackTitle;
    win: boolean;
    data: any;
};

export type ObjectLifecycle = {
    action: PackTitle;
    id: string;
    coords: number[];
    data: any;
};

export type ObjectInfo = {
    action: string,
    list: objectMapInfo[]
}
