import { Config } from './config';
import { Greeter, Person } from './models/greeter';

const g = new Greeter('nick');
console.log(g.greet());


const c = new Config().facets;
