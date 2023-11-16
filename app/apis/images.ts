import {type IapiEndpoint, API_DICEBAR_BASE_URL} from './constants';
import {simpleHash, generateRandomString} from '../utils/math';

let avatarSeed: number | string = '';
export function setAvatarSeed(seed: string | number | undefined = undefined) {
    try {
        avatarSeed = seed ? simpleHash(seed) : generateRandomString(20);
    } catch (error) {
        avatarSeed = generateRandomString(20);
    }
}

// Django is pretty ruthless when it comes to the last stroke(/) after the URL, make sure you add it.
const images: Record<string, IapiEndpoint> = {
    generateAvatar: {
        get url() {
            return (API_DICEBAR_BASE_URL + `/7.x/avataaars/jpeg?seed=${avatarSeed}&eyebrows=default,defaultNatural,raisedExcited,raisedExcitedNatural,unibrowNatural,flatNatural&eyes=default,winkWacky,squint,wink,happy&facialHairProbability=0&mouth=smile,tongue,twinkle,eating,serious,default&skinColor=614335,ae5d29,d08b5b,edb98a&top=bun,dreads,dreads01,dreads02,frizzle,fro,froBand,hat,shaggy,shavedSides,shortCurly,shortFlat,shortRound,shortWaved,sides,theCaesar,theCaesarAndSidePart,turban,winterHat02,winterHat03,winterHat04,winterHat1,frida&backgroundColor=b6e3f4`);
        },
        name: 'External: Generates Avatar For User',
        method: 'GET',
    },
};

export default images;
