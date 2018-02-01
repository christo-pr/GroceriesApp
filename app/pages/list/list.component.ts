import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Grocery } from "../../shared/grocery/grocery";
import { GroceryListService } from "../../shared/grocery/grocery-list.service";
import { TextField } from "ui/text-field";
import * as SocialShare from "nativescript-social-share";

@Component({
  selector: 'list',
  templateUrl: 'pages/list/list.html',
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})
export class ListComponent implements OnInit {
  groceryList: Array<Grocery> = [];
  grocery = "";
  isLoading = false;
  listLoaded = false;
  @ViewChild("greoceryTextField") groceryTextField: ElementRef;

  constructor(private groceryListService: GroceryListService) {}

  ngOnInit() {
    this.isLoading = true;
    this.groceryListService.load()
    .subscribe(loadedGroceries => {
      loadedGroceries.forEach((groceryObject) => {
        this.groceryList.unshift(groceryObject);
      });
      this.isLoading = false;
      this.listLoaded = true;
    });
  }

  add() {
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this.groceryListService.add(this.grocery)
      .subscribe(
        groceryObject => {
          this.groceryList.unshift(groceryObject);
          this.grocery = "";
        },
        () => {
          alert({
            message: "An error occurred while adding an item to your list.",
            okButtonText: "OK"
          });
          this.grocery = "";
        }
      )
  }

  deleteGrocery(id: string) {
    this.groceryListService.delete(id)
      .subscribe( response => {
        this.groceryList = this.groceryList.filter( grocery => grocery.id != id);
        console.log(JSON.stringify('response', response))
      },
      () => {
        alert({
          message: "An error occurred while deleting an item to your list.",
          okButtonText: "OK"
        });
      })
  }

  share() {
    let listString = this.groceryList
      .map(grocery => grocery.name)
      .join(", ")
      .trim();
    SocialShare.shareText(listString);
  }

}
