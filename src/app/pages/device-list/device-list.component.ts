import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  dataSource: MatTableDataSource<[]>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['devicecode', 'container', 'status', 'action'];

  constructor(private router: Router, private homeService: HomeService) {
    
  }

  ngOnInit() {
    this.homeService.getJSON('device-data.json').subscribe((data_response) => {
      this.dataSource = new MatTableDataSource(data_response.DeviceData);
    });
  }

  onClickAdd() {
    this.router.navigate(['/home']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onStart(eventvalue: boolean, index: number) {
    this.dataSource.data[index]['ContainerDetails'].filter((data) => {
      data.Status = eventvalue;
    })
  }

}
