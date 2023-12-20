import authentication from './authentication';
import {services, artisans} from './artisan';
import images from './images';
import {ratings} from './rating';

const apis = {
    ...authentication,
    ...services,
    ...artisans,
    ...images,
    ...ratings,
};

export default apis;
