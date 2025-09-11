import { ImageSource, Loader } from 'excalibur';

export const Resources = {
  Blocks: new ImageSource('./images/blocks.png'),
} as const;

// instantly starts game once loading has completed
class DevLoader extends Loader {
  showPlayButton() {
    return Promise.resolve();
  }

  draw() {}
  dispose() {}
}

export const loader = new DevLoader();
process.env.NODE_ENV === 'development' ? new DevLoader() : new Loader();

for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
