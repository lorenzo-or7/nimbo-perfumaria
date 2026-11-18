import './pages.css'

export default function Privacy() {
  return (
    <div className="page page-enter">
      <div className="wrap prose">
        <header className="page-head">
          <h1 className="display page-title">Privacidade e cookies</h1>
          <p className="lead">Um resumo honesto de como este protótipo trata seus dados.</p>
        </header>
        <h2 className="display">O que é este site</h2>
        <p>
          A NIMBO é uma marca fictícia criada pela Or7 para portfólio. O site é um protótipo demonstrativo: não vende produtos, não processa pagamentos e não tem canais de atendimento.
        </p>
        <h2 className="display">Dados coletados</h2>
        <p>
          Nenhum. Não há cadastro, formulário de contato, login ou envio de informações para servidores. A finalização de pedido não solicita dados pessoais nem de pagamento.
        </p>
        <h2 id="cookies" className="display">
          Cookies e armazenamento local
        </h2>
        <p>
          O protótipo não usa cookies de rastreamento nem ferramentas de análise. Ele guarda no armazenamento local do seu navegador apenas o tema escolhido, os favoritos, a sacola e a lista de comparação. Esses dados ficam no seu
          dispositivo e podem ser apagados limpando os dados do site no navegador.
        </p>
        <h2 className="display">Serviços de terceiros</h2>
        <p>As fontes tipográficas são carregadas do Google Fonts (Instrument Serif) e do Fontshare (Satoshi). Esses serviços recebem a requisição técnica de download das fontes.</p>
        <h2 className="display">Marcas</h2>
        <p>Os perfumes exibidos são produtos reais. Nomes, frascos e logotipos pertencem aos respectivos fabricantes. A NIMBO não declara parceria comercial com nenhuma dessas marcas.</p>
      </div>
    </div>
  )
}
