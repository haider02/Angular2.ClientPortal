import { Component, Input } from '@angular/core';

@Component( {
    selector: "accordion",
    templateUrl: '../dev/tpl/accordion.html'
})
export class AccordionComponent {
    @Input() title: string;
    public visible = false;

	toggle() {
        this.visible = !this.visible;
    }
}