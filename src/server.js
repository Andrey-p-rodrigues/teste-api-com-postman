import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())


//simulação de uma lista de alunos
const alunos = [
    {
        id: 1,
        nome: "Ana Souza",
        email: "ana@email.com",
        idade: 16,
        curso: "Desenvolvimento de Sistemas"
    },
    {
        id: 2,
        nome: "Lucas Martins",
        email: "lucas@email.com",
        idade: 17,
        curso: "Desenvolvimento de Sistemas"
    },
    {
        id: 3,
        nome: "Antonela Braga",
        email: "antonela@email.com",
        idade: 17,
        curso: "Multimídia"
    },
    {
        id: 4,
        nome: "Liz Macedo",
        email: "liz@email.com",
        idade: 16,
        curso: "Robótica"
    }
]

//get - buscar os recursosss
app.get("/alunos", (req, res) => {
    res.status(200).json(alunos)
})

//get por id do aluno
app.get("/alunos/:id", (req, res) => {
    const id = Number(req.params.id)

    const aluno = alunos.find((a) => a.id === id)

    if(!aluno){
        return res.status(404).json({
            mensagem: "Aluno não encontrado"
        })
    }
    res.status(200).json(aluno)
})

//get em curso
app.get("/alunos/curso/:curso", (req, res) => {
    const curso = req.params.curso.toLowerCase()

    const resultado = alunos.filter((aluno) => 
        aluno.curso.toLowerCase().includes(curso)
    )
    res.json(resultado)
})

//POST = cadastrar aluno
app.post("/alunos", (req, res) => {
    const {nome, email, idade, curso } = req.body

    //validando o email
    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ){
        return res.status(400).json({
            mensagem: "E-mail inválido"
        })
    }

    //validadndo a idade
    if(
        typeof idade !== "number" || idade < 0 || idade > 100) {
        return res.status(400).json({
            mensagem: "A idade precisa ser numérica, maior que 0 e menor que 100"
        })
    }

    //cadastra finalmente o alunooo
    const novoAluno = {
        id: alunos.length + 1,
        nome: req.body.nome,
        email: req.body.email,
        idade: req.body.idade,
        curso: req.body.curso
    }

    alunos.push(novoAluno)
    res.status(201).json(novoAluno)

})

app.put("/alunos/:id", (req, res) => {
    const id = Number(req.params.id)
    const indice = alunos.findIndex((aluno) => aluno.id === id)

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Aluno não encontrado"
        })
    }

    const { nome, email, idade, curso } = req.body

    if (
        typeof nome !== "string" || nome.trim() === "" ||
        typeof curso !== "string" || curso.trim() === ""
    ) {
        return res.status(400).json({
            mensagem: "Nome e curso são obrigatórios"
        })
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return res.status(400).json({
            mensagem: "E-mail inválido"
        })
    }

    if (
        typeof idade !== "number" ||
        !Number.isInteger(idade) ||
        idade <= 0 ||
        idade >= 100
    ) {
        return res.status(400).json({
            mensagem: "A idade deve ser um número inteiro entre 1 e 99"
        })
    }

    const alunoAtualizado = {
        id,
        nome: nome.trim(),
        email,
        idade,
        curso: curso.trim()
    }

    alunos[indice] = alunoAtualizado

    return res.status(200).json({
        mensagem: "Aluno atualizado com sucesso",
        aluno: alunoAtualizado
    })
})


// PATCH - atualizar somente a idade do aluno

app.patch("/alunos/:id", (req, res) => {
    const id = Number(req.params.id)
    const aluno = alunos.find((a) => a.id === id)

    if (!aluno) {
        return res.status(404).json({
            mensagem: "Aluno não encontrado"
        })
    }

    const { idade } = req.body

    if (
        typeof idade !== "number" ||
        !Number.isInteger(idade) ||
        idade <= 0 ||
        idade >= 100
    ) {
        return res.status(400).json({
            mensagem: "A idade deve ser um número inteiro entre 1 e 99"
        })
    }

    aluno.idade = idade

    return res.status(200).json({
        mensagem: "Idade atualizada com sucesso",
        aluno
    })
})


// DELETE - excluir um aluno

app.delete("/alunos/:id", (req, res) => {
    const id = Number(req.params.id)
    const indice = alunos.findIndex((aluno) => aluno.id === id)

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Aluno não encontrado"
        })
    }

    const alunoRemovido = alunos.splice(indice, 1)[0]

    return res.status(200).json({
        mensagem: "Aluno excluído com sucesso",
        aluno: alunoRemovido
    })
})

app.listen(3000, () => {

    console.log("Api rodando em http://localhost:3000")
    
})