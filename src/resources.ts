import { ImageSource, Loader } from 'excalibur';

export const Resources = {
  Blocks: new ImageSource('./images/blocks.png'),
} as const;

export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
