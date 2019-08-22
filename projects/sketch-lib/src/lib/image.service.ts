import { Injectable } from '@angular/core';
import { FormatService } from './format.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private format: FormatService) { }

  identify(current: SketchMSLayer) {
    return (current._class as string) === 'bitmap';
  }

  lookup(current: SketchMSLayer, data: SketchMSData) {
    return this.getImageDataFromRef(data, (current as any).image._ref);
  }

  render(current: SketchMSLayer, data: SketchMSData, options: any) {
    return [
      {
        kind: 'png',
        value: this.getImageDataFromRef(data, (current as any).image._ref),
        language: 'base64',
        uri: `${options.assetDir}/${this.format.normalizeName(
          current.name
        )}.png`
      }
    ];
  }

  private getImageDataFromRef(data: SketchMSData, reference: string) {
    return (data as any).images[reference];
  }
}
