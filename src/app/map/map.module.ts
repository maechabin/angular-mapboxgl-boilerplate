import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from '../core/custom-material.module';
import { MapContainerComponent } from './map.container';

@NgModule({
  declarations: [MapContainerComponent],
  imports: [CommonModule, CustomMaterialModule],
  exports: [MapContainerComponent],
})
export class MapModule {}
