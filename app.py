from flask import Flask, render_template, request, jsonify

app = Flask(__name__)   # Cria a aplicação Flask
alunos = []     # Guarda os cadastros na memória
proximo_id = 1  # Contador incremental para garantir IDs únicos mesmo após exclusões

@app.get("/")   # GET: o navegador pede a página inicial
def inicio():
    return render_template("index.html")

@app.post('/api/alunos')    # POST: recebe os dados enviados pelo JavaScript
def cadastrar_aluno():
    global proximo_id
    dados = request.get_json(silent=True) # Converte o JSON em dados Python
    if not isinstance(dados, dict): # Recusa JSON inválido
        return jsonify(mensagem="Envie um objeto JSON válido"), 400

    nome = dados.get("nome")
    email = dados.get("email")
    curso = dados.get("curso")

    # Validação dos três campos: recusa ausentes, não-textos ou apenas espaços
    if not isinstance(nome, str) or not nome.strip():
        return jsonify(mensagem="Preencha o nome do aluno"), 400
    if not isinstance(email, str) or not email.strip():
        return jsonify(mensagem="Preencha o e-mail do aluno"), 400
    if not isinstance(curso, str) or not curso.strip():
        return jsonify(mensagem="Preencha o curso do aluno"), 400

    aluno = {
        'id': proximo_id,
        'nome': nome.strip(),
        'email': email.strip(),
        'curso': curso.strip()
    }
    proximo_id += 1
    alunos.append(aluno)    # Adiciona o aluno à lista

    return jsonify(
        mensagem=f'Aluno {aluno["nome"]} cadastrado com sucesso! ID: {aluno["id"]}',
        id=aluno["id"],
        aluno=aluno
    ), 201

@app.delete('/api/alunos/<int:aluno_id>')   # DELETE: remove um aluno pelo ID
def excluir_aluno(aluno_id):
    for aluno in alunos:
        if aluno['id'] == aluno_id:
            alunos.remove(aluno)    # Remove o cadastro da lista no servidor
            return jsonify(mensagem=f'Aluno com ID {aluno_id} excluído com sucesso!'), 200
            
    return jsonify(mensagem=f'Aluno com ID {aluno_id} não encontrado.'), 404

if __name__ == "__main__":  # Executa apenas ao rodar este arquivo diretamente
    app.run() # Servidor local para demonstração