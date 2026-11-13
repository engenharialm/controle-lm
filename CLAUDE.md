# Controle LM (Mão de Obra e Equipamentos)

Site oficial: https://engenharialm.github.io/controle-lm/ (GitHub Pages direto do branch `main`).
Tudo fica em um único `index.html` (HTML + JS puro, sem build). Dados reais no Firebase/Firestore, projeto `lm-construtora-13c8f`.
O usuário (engenharia da LM Construtora) fala português: responda em português, de forma simples.

## Regras
- **Antes de qualquer gravação destrutiva no Firestore real, salvar backup em arquivo e conferir.** Não gravar dados de teste no banco real.
- Testar em PC e celular antes de publicar. Para testar sem tocar no banco, copiar o `index.html` para uma pasta temporária,
  trocar `apiKey` por `"COLE_AQUI"` (vira modo local, dados no localStorage) e servir com `python -m http.server`.
- Para saber se uma coleção nova aceita gravação sem gravar nada: `:commit` via REST com `currentDocument.exists=true`
  num id inexistente (resposta NOT_FOUND = permitido; PERMISSION_DENIED = bloqueado).
- Publicar = commit + push no `main`; o Pages leva 1–3 min. Conferir no site antes de dizer que está no ar.
- Commitar só o `index.html` (e o que for do pedido); os `backup-*.xlsx/json` e `cotacoes.html` são locais, não vão pro GitHub.

## Coleções do Firestore
- `colaboradores`, `obras`, `importacoes` — mão de obra (a importação semanal APAGA e recria os registros da obra, com ids novos).
- `equipamentos`, `equipamentosObras`, `equipamentosImportacoes`, `equipamentosFotos` — equipamentos por obra.
- `equipamentosMestre` — Lista Mestre (cadastro fixo da frota). Ligada aos equipamentos das obras em `sincronizarMestre()`
  por `alocId`, placa/TAG/chassis/renavam ou tipo+marca+modelo; nunca some com a planilha.
- `movimentacoes` — histórico (só acrescenta), gravado pelos wrappers de `addHistoricoTo()`.
- `equipamentosDocs`/`equipamentosDocsPartes` (contrato e medições, ligados ao `mestreId`) e
  `colaboradoresDocs`/`colaboradoresDocsPartes` (ASO, treinamentos, carteira, ligados ao nome normalizado `pessoaChave`).
  Arquivos em base64 em pedaços de ~700 KB (o Firebase Storage do projeto não está ativado); limite 15 MB por arquivo.
- `config/*` — mapeamento folha x obra, resumo do cruzamento, data de compatibilização.

## Senha
Edições pedem a senha `SITE_PASSWORD` (trava simples, não é segurança real). O nome de quem altera é pedido uma vez por aparelho (histórico).
