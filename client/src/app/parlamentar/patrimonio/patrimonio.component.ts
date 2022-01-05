import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { PerfilPoliticoService } from '../../shared/services/perfil-politico.service';

@Component({
  selector: 'app-patrimonio',
  templateUrl: './patrimonio.component.html',
  styleUrls: ['./patrimonio.component.scss']
})
export class PatrimonioComponent implements OnInit {

  medianaPatrimonio: any;
  patrimonio: any;
  temPatrimonio: boolean;
  requestError: boolean;
  isLoading: boolean;

  constructor(
    private activatedroute: ActivatedRoute,
    private perfilPoliticoService: PerfilPoliticoService,
    private parlamentarService: ParlamentarService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getPerfilPolitico(params.id);
    });
  }

  getPerfilPolitico(id) {
    this.parlamentarService
      .getInfoById(id)
      .pipe(take(1))
      .subscribe(
        parlamentar => {
          if (parlamentar.idPerfilPolitico) {
            this.perfilPoliticoService
              .get(parlamentar.idPerfilPolitico)
              .pipe(take(1))
              .subscribe(
                resp => this.handleRequestResponse(resp),
                err => this.handleRequestError(err),
              );
          }
        },
        err => this.handleRequestError(err),
      )
  }

  handleRequestResponse(resp) {
    const patrimonio = resp.asset_history || [];
    this.requestError = false;
    this.patrimonio = patrimonio;
    this.temPatrimonio = patrimonio.length > 0;
    this.isLoading = false;
    // todo -> buscar da api ao invés de deixar hardcoded
    this.medianaPatrimonio = [
      {year: 2006, value: 22711.75},
      {year: 2008, value: 20000},
      {year: 2010, value: 30000},
      {year: 2012, value: 25000},
      {year: 2014, value: 39338.68},
      {year: 2016, value: 25000},
    ];
  }

  handleRequestError(error) {
    console.log('Erro ao buscar parlamentar: ', error);
    this.temPatrimonio = false;
    this.requestError = true;
    this.isLoading = false;
  }

  onClickModal(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'Sobre'});
  }
}
