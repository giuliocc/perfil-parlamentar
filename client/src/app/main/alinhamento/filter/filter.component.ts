import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { estados } from '../../../shared/constants/estados';
import { ParlamentarService } from '../../../shared/services/parlamentar.service';
import { TemaService } from 'src/app/shared/services/tema.service';
import { Tema } from '../../../shared/models/tema.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  readonly FILTRO_PADRAO_ESTADO = "Estados";
  readonly FILTRO_PADRAO_PARTIDO = "Partidos";
  filtro: any;

  private unsubscribe = new Subject();

  partidosPorEstado: any[];

  estados: string[];
  partidosFiltradosPorEstado: string[];
  temas: Tema[];

  temaSelecionado: string;
  estadoSelecionado: string;
  nomePesquisado: string;
  partidoSelecionado: string;

  constructor(
    private modalService: NgbModal,
    private parlamentarService: ParlamentarService,
    private temaService: TemaService
  ) {
    this.estados = estados;
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;

    this.filtro = {
      nome: "",
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado
    }
  }

  ngOnInit() {
    this.parlamentarService.getPartidosPorEstado().pipe(takeUntil(this.unsubscribe)).subscribe(
      partidos => {
        this.partidosPorEstado = partidos;
        this.onChangeEstado();
      }
    );

    this.getTemas();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Filtros para Alinhamento' });
  }

  onChangeEstado() {
    this.partidosFiltradosPorEstado = this.partidosPorEstado.filter(value => value.estado === this.estadoSelecionado)[0].partidos;

    if (!this.partidosFiltradosPorEstado.includes("Partidos"))
      this.partidosFiltradosPorEstado.splice(0, 0, "Partidos");

    if (!this.partidosFiltradosPorEstado.includes(this.partidoSelecionado)) {
      this.partidoSelecionado = "Partidos";
    }
  }

  aplicarFiltro() {
    this.filtro = {
      nome: this.nomePesquisado,
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado,
      tema: this.temaSelecionado
    }

    this.filterChange.emit(this.filtro);
    this.modalService.dismissAll();
  }

  limparFiltro() {
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.nomePesquisado = "";

    this.aplicarFiltro();
  }

  limparFiltroEstado() {
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.onChangeEstado();
    this.aplicarFiltro();
  }

  limparFiltroPartido() {
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.aplicarFiltro();
  }

  getTemas() {
    this.temaService.getTemas().pipe(takeUntil(this.unsubscribe)).subscribe((temas) => {
      this.temas = temas;
    });
  }

  isTemaSelected(idTema: number) {
    return this.temaSelecionado === idTema.toString(10);
  }

  selecionaTema(idTema: number) {
    let id = idTema.toString(10);

    if (this.temaSelecionado === id)
      this.temaSelecionado = "";
    else
      this.temaSelecionado = id;
  }

}
