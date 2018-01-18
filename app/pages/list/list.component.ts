import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Grocery } from "../../shared/grocery/grocery";
import { GroceryListService } from "../../shared/grocery/grocery-list.service";

@Component({
  selector: 'list',
  templateUrl: 'pages/list/list.html',
  providers: [GroceryListService]
})
export class ListComponent implements OnInit {
  groceryList: Array<Grocery> = [];

  constructor(private groceryListService: GroceryListService) {}

  ngOnInit() {
    this.groceryListService.load()
    .subscribe(loadedGroceries => {
      loadedGroceries.forEach((groceryObject) => {
        this.groceryList.unshift(groceryObject);
      });
    });
  }

}
