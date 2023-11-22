import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatarValor } from '../../utilitario';
import './css/lista-vendas.css';

const ListaVendas = ({ onSetTitulo }) => {

  const [vendas, setDados] = useState([]);
  const [showItens, setShowItens] = useState({});

  useEffect(() => {
    onSetTitulo("Vendas");
  }, [onSetTitulo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/vendas/');
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      }
    };
    fetchData();
  }, []);

  const handleVerItens = (vendaId) => {
    setShowItens({
      ...showItens,
      [vendaId]: !showItens[vendaId],
    });
  };

  const handle_delete = async (vendaId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/venda/${vendaId}`);
      
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
    }
  };
  
  return (
    <div>
      <div className="container-header">
        <h2 className="header-subtitle">Vendas Realizadas</h2>
        <Link to="/novavenda"><button className="inserir-btn">Inserir nova Venda</button></Link>
      </div>
      <div className="tabela-container-flex">
          <div className="tabela-row">
            <div className="tabela-cell">
              <strong className="tittle-table">Nota Fiscal</strong>
            </div>
            <div className="tabela-cell">
              <strong className="tittle-table">Cliente</strong>
            </div>
            <div className="tabela-cell">
              <strong className="tittle-table">Vendedor</strong>
            </div>
            <div className="tabela-cell">
              <strong className="tittle-table">Data Venda</strong>
            </div>
            <div className="tabela-cell">
              <strong className="tittle-table">Valor Total</strong>
            </div>
            <div className="tabela-cell">
              <strong className="tittle-table">Opções</strong>
            </div>
          </div>
      </div>
      <div className="tabela-container-flex">
        {vendas.map((venda) => (
          <div key={venda.id}>
              <div className="tabela-row">
                <div className="tabela-cell">
                  {venda.num_notafiscal}
                </div>
                <div className="tabela-cell">
                  {venda.cliente}
                </div>
                <div className="tabela-cell">
                  {venda.vendedor}
                </div>
                <div className="tabela-cell">
                  {venda.dataehora}
                </div>
                <div className="tabela-cell">
                  {formatarValor(venda.valor_total)}
                </div>
                <div className="tabela-cell">
                  <button className="verBtn" onClick={() => handleVerItens(venda.id)}>
                    {showItens[venda.id] ? 'Fechar' : 'Ver Itens'}
                  </button>
                  <a href={`/detalhes/${venda.id}`} className="editarBtn">
                    <FontAwesomeIcon icon={faEdit}/>
                  </a>
                  <a className="excluirBtn" onClick={() => handle_delete(venda.id)}>
                    <FontAwesomeIcon icon={faTrash}/>
                  </a>
                </div>
              </div>
            {showItens[venda.id] && (
                <div className="tabela-itens">
                  <table>
                    <thead>
                      <tr>
                        <th>Produtos/Serviços</th>
                        <th>Quantidade</th>
                        <th>Preço unitário</th>
                        <th>Total do produto</th>
                        <th>% de comissão</th>
                        <th>Comissão</th>
                      </tr>
                    </thead>
                    <tbody>
                    {venda.itemvenda_set.map((item, index) => (
                      <tr key={`item_${item.id || index}`}>
                        <td>{item.produto.descricao}</td>
                        <td>{item.quantidade}</td>
                        <td>{formatarValor(item.produto.valor)}</td>
                        <td>{formatarValor(item.quantidade * item.produto.valor)}</td>
                        <td>{item.produto.comissao} %</td>
                        <td>{formatarValor(((item.quantidade * item.produto.valor)*item.produto.comissao) /100)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td><strong>Total da venda</strong></td>
                      <td><strong>{venda.total_itens}</strong></td>
                      <td></td>
                      <td><strong>{formatarValor(venda.valor_total)}</strong></td>
                      <td></td>
                      <td><strong>{formatarValor(venda.valor_total_comissoes)}</strong></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaVendas;
