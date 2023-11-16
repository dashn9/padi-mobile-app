import authentication from './authentication';
import {services, artisans} from './artisans';
import images from './images';

const apis = {
    ...authentication,
    ...services,
    ...artisans,
    ...images,
};

export default apis;
