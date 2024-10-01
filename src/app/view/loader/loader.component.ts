import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

}
