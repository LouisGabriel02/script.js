window.addEventListener('DOMContentLoaded', function () {
    this.sessionStorage.setItem('loggedIn', 'false');
    this.sessionStorage.setItem('type', 'N/A');

    Misc.generateHeader();
    Jobs.createMainPage();
});

class Misc {
    static generateHeader() {
        let header = document.querySelector('header');
        header.innerHTML = '';

        var img = document.createElement('img');
        img.src = 'img/logo.jpeg';
        header.appendChild(img);

        if (sessionStorage.getItem('loggedIn') == 'false') {
            var button = document.createElement('button');
            button.innerHTML = 'Acasa';
            button.onclick = Jobs.createMainPage;
            header.appendChild(button);

            button = document.createElement('button');
            button.innerHTML = 'Autentificare';
            button.onclick = Auth.createLoginPage;
            header.appendChild(button);

            button = document.createElement('button');
            button.innerHTML = 'Inregistrare';
            button.onclick = Auth.createRegisterPage;
            header.appendChild(button);
        }
        else {
            if (sessionStorage.getItem('type') == 'user') {
                var button = document.createElement('button');
                button.innerHTML = 'Acasa';
                button.onclick = Jobs.createMainPage;
                header.appendChild(button);

                button = document.createElement('button');
                button.innerHTML = 'Profil';
                button.onclick = User.createProfilePage;
                header.appendChild(button);

                button = document.createElement('button');
                button.innerHTML = 'Job-urile mele';
                button.onclick = User.createMyJobsPage;
                header.appendChild(button);
            }
            else {
                var button = document.createElement('button');
                button.innerHTML = 'Acasa';
                button.onclick = Org.createMainPage;
                header.appendChild(button);

                button = document.createElement('button');
                button.innerHTML = 'Joburi';
                button.onclick = Org.creatMyJobsPage;
                header.appendChild(button);
            }

            var button = document.createElement('button');
            button.innerHTML = 'Logout';
            button.onclick = Auth.logout;
            header.appendChild(button);
        }
    }

    static async selectButton(name) {
        var btns = document.querySelector('header').querySelectorAll('button');

        btns.forEach(btn => {
            if (btn.innerHTML == name) {
                btn.style.borderColor = 'white';
            }
            else {
                btn.style.borderColor = 'transparent';
            }
        });
    }
}

class Auth {
    static async createLoginPage() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.selectButton('Autentificare');

        var page = document.createElement('div');
        page.className = 'column';
        main.appendChild(page);

        var form = document.createElement('div');
        form.className = 'form';
        page.appendChild(form);

        var span = document.createElement('span');
        span.innerHTML = 'Autentificare';
        form.appendChild(span);

        var label = document.createElement('label');
        label.innerHTML = 'Email';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'email';
        form.appendChild(input);

        label = document.createElement('label');
        label.innerHTML = 'Parola';
        form.appendChild(label);

        input = document.createElement('input');
        input.type = 'password';
        input.id = 'password';
        form.appendChild(input);

        span = document.createElement('span');
        span.id = 'error';
        span.style.color = 'red';
        form.appendChild(span);

        var button = document.createElement('button');
        button.innerHTML = 'Autentificare';
        button.onclick = Auth.login;
        button.className = 'button';
        form.appendChild(button);
    }

    static async createRegisterPage() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.selectButton('Inregistrare');

        var page = document.createElement('div');
        page.className = 'column';
        main.appendChild(page);

        var form = document.createElement('div');
        form.className = 'form';
        page.appendChild(form);

        var span = document.createElement('span');
        span.innerHTML = 'Inregistrare';
        form.appendChild(span);

        var label = document.createElement('label');
        label.innerHTML = 'Email';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'email';
        form.appendChild(input);

        label = document.createElement('label');
        label.innerHTML = 'Nume';
        form.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.id = 'lastName';
        form.appendChild(input);

        label = document.createElement('label');
        label.innerHTML = 'Prenume';
        form.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.id = 'firstName';
        form.appendChild(input);

        label = document.createElement('label');
        label.innerHTML = 'Parola';
        form.appendChild(label);

        input = document.createElement('input');
        input.type = 'password';
        input.id = 'password';
        form.appendChild(input);

        label = document.createElement('label');
        label.innerHTML = 'Confirmare parola';
        form.appendChild(label);

        input = document.createElement('input');
        input.type = 'password';
        input.id = 'confirmPassword';
        form.appendChild(input);

        span = document.createElement('span');
        span.id = 'error';
        span.style.color = 'red';
        form.appendChild(span);

        var button = document.createElement('button');
        button.innerHTML = 'Inregistrare';
        button.onclick = Auth.register;
        button.className = 'button';
        form.appendChild(button);
    }

    static async register() {
        var email = document.getElementById('email').value;
        var lastName = document.getElementById('lastName').value;
        var firstName = document.getElementById('firstName').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;
        var error = document.getElementById('error');

        if (email == '' || lastName == '' || firstName == '' || password == '' || confirmPassword == '') {
            error.innerHTML = 'Toate campurile sunt obligatorii!';
            return;
        }

        if (email.includes('@') == false || email.includes('.') == false) {
            error.innerHTML = 'Email-ul nu este valid!';
            return;
        }

        var response = await fetch('../recrutareData/api/auth/checkEmail.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            })
        });

        var data = await response.json();

        if (data.exists == true) {
            error.innerHTML = 'Email-ul este deja folosit!';
            return;
        }

        if (password.length < 8) {
            error.innerHTML = 'Parola trebuie sa aiba cel putin 8 caractere!';
            return;
        }

        if (/[a-z]/.test(password) == false || /[A-Z]/.test(password) == false || /\d/.test(password) == false || /[^a-zA-Z0-9]/.test(password) == false) {
            error.innerHTML = 'Parola trebuie sa contina cel putin o litera mica,<br> o litera mare, o cifra si un caracter special!';
            return;
        }

        if (password != confirmPassword) {
            error.innerHTML = 'Parolele nu coincid!';
            return;
        }

        var response = await fetch('../recrutareData/api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                lastName: lastName,
                firstName: firstName,
                password: password
            })
        });

        var data = await response.json();

        if (data.success == true) {
            error.innerHTML = 'Contul a fost creat cu succes!';
            error.style.color = 'green';
            setTimeout(Auth.createLoginPage, 2000);
        }
        else {
            error.innerHTML = 'Eroare la crearea contului!';
        }
    }

    static async login() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var error = document.getElementById('error');

        if (email == '' || password == '') {
            error.innerHTML = 'Toate campurile sunt obligatorii!';
            return;
        }

        var response = await fetch('../recrutareData/api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        var data = await response.json();

        if (data.success == true) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('type', data.type);
            sessionStorage.setItem('id', data.id);
            Misc.generateHeader();

            if (data.type == 'user') {
                Jobs.createMainPage();
            }
            else {
                Org.createMainPage();
            }
        }
        else {
            error.innerHTML = 'Email sau parola gresite!';

        }
    }

    static async logout() {
        sessionStorage.clear();
        sessionStorage.setItem('loggedIn', 'false');
        sessionStorage.setItem('type', 'N/A');
        Misc.generateHeader();
        Jobs.createMainPage();
    }
}

class Jobs {

    static async createMainPage() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.selectButton('Acasa');

        var response = await fetch('../recrutareData/api/jobs/getJobs.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        var data = await response.json();

        data.forEach(job => {

            var p = document.createElement('div');
            p.className = 'column';
            main.appendChild(p);

            var card = document.createElement('div');
            card.className = 'data-card';
            p.appendChild(card);

            var span = document.createElement('span');
            span.innerHTML = 'Date Job';
            span.className = 'span-color';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            var row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            row.style.marginTop = '1rem';
            card.appendChild(row);

            var rr = document.createElement('div');
            rr.className = 'row';
            rr.style.flex = '1';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Titlu';
            span.className = 'span-gray';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = job.title;
            span.className = 'span-color';
            span.style.marginLeft = '3rem';
            rr.appendChild(span);

            rr = document.createElement('div');
            rr.className = 'row';
            rr.style.flex = '1';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Angajator';
            span.className = 'span-gray';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = job.firstName + ' ' + job.lastName;
            span.className = 'span-color';
            span.style.marginLeft = '4.7rem';
            rr.appendChild(span);

            row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            card.appendChild(row);

            rr = document.createElement('div');
            rr.className = 'row';
            rr.style.flex = '1';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Tip job';
            span.className = 'span-gray';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = job.type;
            span.className = 'span-color';
            span.style.marginLeft = '2rem';
            rr.appendChild(span);

            rr = document.createElement('div');
            rr.className = 'row';
            rr.style.flex = '1';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Mod de lucru';
            span.className = 'span-gray';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = job.mode;
            span.className = 'span-color';
            span.style.marginLeft = '3.3rem';
            rr.appendChild(span);

            row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            card.appendChild(row);

            rr = document.createElement('div');
            rr.className = 'row';
            rr.style.flex = '1';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Locatie';
            span.className = 'span-gray';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = job.location;
            span.className = 'span-color';
            span.style.marginLeft = '2rem';
            rr.appendChild(span);

            rr = document.createElement('div');
            rr.className = 'row';
            rr.style.flex = '1';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Nivel experienta';
            span.className = 'span-gray';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = job.level;
            span.className = 'span-color';
            span.style.marginLeft = '2rem';
            rr.appendChild(span);

            row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            card.appendChild(row);

            rr = document.createElement('div');
            rr.className = 'row';
            rr.style.flex = '1';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Salariu';
            span.className = 'span-gray';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = job.salary_start + ' - ' + job.salary_end + ' RON';
            span.className = 'span-color';
            span.style.marginLeft = '2rem';
            rr.appendChild(span);

            rr = document.createElement('div');
            rr.className = 'row';
            rr.style.flex = '1';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Candidati';
            span.className = 'span-gray';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = job.enrolled;
            span.className = 'span-color';
            span.style.marginLeft = '5rem';
            rr.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = 'Descriere';
            span.className = 'span-color';
            span.style.marginTop = '2rem';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = '&emsp;' + job.description;
            span.className = 'span-gray';
            span.style.marginTop = '1rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = 'Cerinte';
            span.className = 'span-color';
            span.style.marginTop = '2rem';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = '&emsp;' + job.requirements;
            span.className = 'span-gray';
            span.style.marginTop = '1rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = 'Responsabilitati';
            span.className = 'span-color';
            span.style.marginTop = '2rem';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = '&emsp;' + job.responsibilities;
            span.className = 'span-gray';
            span.style.marginTop = '1rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = 'Beneficii';
            span.className = 'span-color';
            span.style.marginTop = '2rem';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = '&emsp;' + job.benefits;
            span.className = 'span-gray';
            span.style.marginTop = '1rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = 'Despre noi';
            span.className = 'span-color';
            span.style.marginTop = '2rem';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            span = document.createElement('span');
            span.innerHTML = '&emsp;' + job.about_us;
            span.className = 'span-gray';
            span.style.marginTop = '1rem';
            card.appendChild(span);

            row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            row.style.justifyContent = 'center';
            card.appendChild(row);

            var button = document.createElement('button');
            button.innerHTML = 'Aplica';
            button.className = 'button';
            button.style.marginTop = '0';
            if (sessionStorage.getItem('loggedIn') == 'true') {
                button.onclick = function () {
                    Jobs.applyJob(job.id);
                }
            }
            else {
                button.onclick = function () {
                    Auth.createLoginPage();
                }
            }
            row.appendChild(button);

            var input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            input.accept = 'application/pdf';
            input.id = 'cv-' + job.id;
            input.style.marginLeft = '1rem';
            row.appendChild(input);

        });
    }

    static async applyJob(jobId) {
        var cv = document.getElementById('cv-' + jobId);

        if (cv.style.display == 'none') {
            cv.style.display = 'block';
            return;
        }

        if (cv.files.length == 0) {
            window.alert('Va rugam sa incarcati un CV!');
            return;
        }

        var r = window.confirm('Sunteti sigur ca doriti sa aplicati la acest job?');

        if (r == false)
            return;

        cv = cv.files[0];

        var reader = new FileReader();
        reader.readAsDataURL(cv);
        reader.onload = async function () {
            var response = await fetch('../recrutareData/api/jobs/applyJob.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idjob: jobId,
                    iduser: sessionStorage.getItem('id'),
                    cv: reader.result
                })
            });

            var data = await response.json();

            if (data.success == true) {
                if (data.exists == true) {
                    alert('Ati aplicat deja la acest job!');
                    Jobs.createMainPage();
                }
                else {
                    alert('Aplicatia a fost trimisa cu succes!');
                    User.createMyJobsPage();
                }
            }
            else {
                alert('Eroare la trimiterea aplicatiei!');
            }
        }
    }

    static async deleteJob(id) {
        var r = window.confirm('Sunteti sigur ca doriti sa stergeti acest job?');

        if (r == false)
            return;

        var response = await fetch('../recrutareData/api/jobs/deleteJob.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        });

        var data = await response.json();

        if (data.success == true) {
            alert('Jobul a fost sters cu succes!');
            Org.creatMyJobsPage();
        }
        else {
            alert('Eroare la stergerea jobului!');
        }
    }

    static async changeStatus(id, status) {
        var response = await fetch('../recrutareData/api/jobs/changeStatus.php', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                status: status
            })
        });

        var data = await response.json();

        if (data.success != true) {
            alert('Eroare la schimbarea statusului!');
        }
    }

    static async saveMeeting(id, start, end, name) {
        if (start == '' || end == '' || name == '') {
            alert('Toate campurile sunt obligatorii!');
            return;
        }

        start = Math.floor(new Date(start).getTime() / 1000);
        end = Math.floor(new Date(end).getTime() / 1000);

        var response = await fetch('../recrutareData/api/jobs/saveMeeting.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                start: start,
                end: end,
                name: name
            })
        });

        var data = await response.json();

        if (data.success != true) {
            alert('Eroare la salvarea intalnirii!');
        }
    }
}

class User {
    static createExeperienceContainer() {
        var div = document.createElement('div');
        div.className = 'one-experience-container';

        var row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        div.appendChild(row);

        var rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        var span = document.createElement('span');
        span.innerHTML = 'Pozitie';
        span.className = 'span-gray';
        rr.appendChild(span);

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'position';
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Angajator';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.name = 'employer';
        rr.appendChild(input);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        div.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Data inceput';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'date';
        input.name = 'startDate';
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Data sfarsit';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'date';
        input.name = 'endDate';
        rr.appendChild(input);

        var text = document.createElement('textarea');
        text.placeholder = 'Descriere';
        text.name = 'description';
        text.style.width = '100%';
        text.style.height = '7rem';
        text.style.marginTop = '1rem';
        div.appendChild(text);

        return div;

    }

    static createEducationContainer() {
        var div = document.createElement('div');
        div.className = 'one-education-container';

        var row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        div.appendChild(row);

        var rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        var span = document.createElement('span');
        span.innerHTML = 'Institutie';
        span.className = 'span-gray';
        rr.appendChild(span);

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'institution';
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Specializare';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.name = 'specialization';
        rr.appendChild(input);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        div.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Data inceput';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'date';
        input.name = 'startDate';
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Data sfarsit';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'date';
        input.name = 'endDate';
        rr.appendChild(input);

        var text = document.createElement('textarea');
        text.placeholder = 'Descriere';
        text.name = 'description';
        text.style.width = '100%';
        text.style.height = '7rem';
        text.style.marginTop = '1rem';
        div.appendChild(text);

        return div;
    }

    static createSkillContainer() {
        var dest = document.getElementById('skills-container');

        var div = document.createElement('div');
        div.className = 'one-skill-container';
        dest.appendChild(div);

        var row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        div.appendChild(row);

        var rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        var span = document.createElement('span');
        span.innerHTML = 'Skill';
        span.className = 'span-gray';
        rr.appendChild(span);

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'skill';
        rr.appendChild(input);

        span = document.createElement('span');
        span.innerHTML = 'Nivel';
        span.className = 'span-gray';
        rr.appendChild(span);

        var select = document.createElement('select');
        select.name = 'level';
        select.style.width = '5rem';
        rr.appendChild(select);

        for (var i = 1; i <= 10; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            select.appendChild(option);
        }

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Job/Proiect';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.name = 'where';
        rr.appendChild(input);

        return div;
    }

    static createLanguageContainer() {
        var dest = document.getElementById('languages-container');

        var div = document.createElement('div');
        div.className = 'one-language-container';
        dest.appendChild(div);

        var row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        div.appendChild(row);

        var rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        var span = document.createElement('span');
        span.innerHTML = 'Limba';
        span.className = 'span-gray';
        rr.appendChild(span);

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'language';
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Nivel';
        span.className = 'span-gray';
        rr.appendChild(span);

        var select = document.createElement('select');
        select.name = 'level';
        select.style.width = '10rem';
        rr.appendChild(select);

        var option = document.createElement('option');
        option.value = 'Incepator';
        option.innerHTML = 'Incepator';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Mediu';
        option.innerHTML = 'Mediu';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Avansat';
        option.innerHTML = 'Avansat';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Nativ';
        option.innerHTML = 'Nativ';
        select.appendChild(option);

        return div;
    }

    static async createProfilePage() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.selectButton('Profil');

        var response = await fetch('../recrutareData/api/user/getProfile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: sessionStorage.getItem('id')
            })
        });

        var data = await response.json();

        if (data.data != '' && data.data != null) {
            User.populateProfilePage(data.data);
        }
        else {
            var p = document.createElement('div');
            p.className = 'column';
            main.appendChild(p);

            // Profile card
            {
                var card = document.createElement('div');
                card.className = 'data-card';
                card.id = 'profile';
                p.appendChild(card);

                var span = document.createElement('span');
                span.innerHTML = 'Profil';
                span.className = 'span-color';
                span.style.fontSize = '1.5rem';
                card.appendChild(span);

                var row = document.createElement('div');
                row.className = 'row';
                row.style.width = '100%';
                row.style.marginTop = '1rem';
                card.appendChild(row);

                var rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Pozitie';
                span.className = 'span-gray';
                rr.appendChild(span);

                var input = document.createElement('input');
                input.type = 'text';
                input.id = 'position';
                rr.appendChild(input);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Angajator';
                span.className = 'span-gray';
                rr.appendChild(span);

                input = document.createElement('input');
                input.type = 'text';
                input.id = 'employer';
                rr.appendChild(input);

                row = document.createElement('div');
                row.className = 'row';
                row.style.width = '100%';
                row.style.marginTop = '1rem';
                card.appendChild(row);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Nume';
                span.className = 'span-gray';
                rr.appendChild(span);

                input = document.createElement('input');
                input.type = 'text';
                input.id = 'lastName';
                input.value = data.lastName;
                input.disabled = true;
                rr.appendChild(input);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Prenume';
                span.className = 'span-gray';
                rr.appendChild(span);

                input = document.createElement('input');
                input.type = 'text';
                input.id = 'firstName';
                input.value = data.firstName;
                input.disabled = true;
                rr.appendChild(input);

                row = document.createElement('div');
                row.className = 'row';
                row.style.width = '100%';
                row.style.marginTop = '1rem';
                card.appendChild(row);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Email';
                span.className = 'span-gray';
                rr.appendChild(span);

                input = document.createElement('input');
                input.type = 'text';
                input.id = 'email';
                input.value = data.email;
                input.disabled = true;
                rr.appendChild(input);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Telefon';
                span.className = 'span-gray';
                rr.appendChild(span);

                input = document.createElement('input');
                input.type = 'text';
                input.id = 'phone';
                rr.appendChild(input);

                row = document.createElement('div');
                row.className = 'row';
                row.style.width = '100%';
                row.style.marginTop = '1rem';
                card.appendChild(row);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Oras';
                span.className = 'span-gray';
                rr.appendChild(span);

                input = document.createElement('input');
                input.type = 'text';
                input.id = 'city';
                rr.appendChild(input);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Judet';
                span.className = 'span-gray';
                rr.appendChild(span);

                input = document.createElement('input');
                input.type = 'text';
                input.id = 'county';
                rr.appendChild(input);

                row = document.createElement('div');
                row.className = 'row';
                row.style.width = '100%';
                row.style.marginTop = '1rem';
                card.appendChild(row);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Data nasterii';
                span.className = 'span-gray';
                rr.appendChild(span);

                input = document.createElement('input');
                input.type = 'date';
                input.id = 'birthDate';
                rr.appendChild(input);
            }

            // Experience card

            {
                card = document.createElement('div');
                card.className = 'data-card';
                card.id = 'experience';
                p.appendChild(card);

                span = document.createElement('span');
                span.innerHTML = 'Experienta';
                span.className = 'span-color';
                span.style.fontSize = '1.5rem';
                card.appendChild(span);

                var colExp = document.createElement('div');
                colExp.className = 'column';
                colExp.style.width = '100%';
                colExp.id = 'experience-container';
                card.appendChild(colExp);

                colExp.appendChild(User.createExeperienceContainer());

                var button = document.createElement('button');
                button.innerHTML = 'Adauga';
                button.className = 'button';
                button.onclick = function () {
                    colExp.appendChild(User.createExeperienceContainer());
                }
                card.appendChild(button);
            }

            // Education card

            {
                card = document.createElement('div');
                card.className = 'data-card';
                card.id = 'education';
                p.appendChild(card);

                span = document.createElement('span');
                span.innerHTML = 'Educatie';
                span.className = 'span-color';
                span.style.fontSize = '1.5rem';
                card.appendChild(span);

                var colEdu = document.createElement('div');
                colEdu.className = 'column';
                colEdu.style.width = '100%';
                colEdu.id = 'education-container';
                card.appendChild(colEdu);

                colEdu.appendChild(User.createEducationContainer());

                var button = document.createElement('button');
                button.innerHTML = 'Adauga';
                button.className = 'button';
                button.onclick = function () {
                    colEdu.appendChild(User.createEducationContainer());
                }
                card.appendChild(button);
            }

            // Skills card

            {
                card = document.createElement('div');
                card.className = 'data-card';
                card.id = 'skills';
                p.appendChild(card);

                span = document.createElement('span');
                span.innerHTML = 'Skill-uri';
                span.className = 'span-color';
                span.style.fontSize = '1.5rem';
                card.appendChild(span);

                var colSk = document.createElement('div');
                colSk.id = 'skills-container';
                colSk.className = 'column';
                colSk.style.width = '100%';
                card.appendChild(colSk);

                colSk.appendChild(User.createSkillContainer());

                var button = document.createElement('button');
                button.innerHTML = 'Adauga';
                button.className = 'button';
                button.onclick = function () {
                    colSk.appendChild(User.createSkillContainer());
                }
                card.appendChild(button);

            }

            // Languages card

            {
                card = document.createElement('div');
                card.className = 'data-card';
                card.id = 'languages';
                p.appendChild(card);

                span = document.createElement('span');
                span.innerHTML = 'Limbi straine';
                span.className = 'span-color';
                span.style.fontSize = '1.5rem';
                card.appendChild(span);

                var colLang = document.createElement('div');
                colLang.id = 'languages-container';
                colLang.className = 'column';
                colLang.style.width = '100%';
                card.appendChild(colLang);

                var div = document.createElement('div');
                div.className = 'one-language-container';
                colLang.appendChild(div);

                var row = document.createElement('div');
                row.className = 'row';
                row.style.width = '100%';
                div.appendChild(row);

                var rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                var span = document.createElement('span');
                span.innerHTML = 'Limba';
                span.className = 'span-gray';
                rr.appendChild(span);

                var input = document.createElement('input');
                input.type = 'text';
                input.name = 'language';
                rr.appendChild(input);

                rr = document.createElement('div');
                rr.className = 'rr';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Nivel';
                span.className = 'span-gray';
                rr.appendChild(span);

                var select = document.createElement('select');
                select.name = 'level';
                select.style.width = '10rem';
                rr.appendChild(select);

                var option = document.createElement('option');
                option.value = 'Incepator';
                option.innerHTML = 'Incepator';
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'Mediu';
                option.innerHTML = 'Mediu';
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'Avansat';
                option.innerHTML = 'Avansat';
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'Nativ';
                option.innerHTML = 'Nativ';
                select.appendChild(option);

                var button = document.createElement('button');
                button.innerHTML = 'Adauga';
                button.className = 'button';
                button.onclick = function () {
                    colLang.appendChild(User.createLanguageContainer());
                }
                card.appendChild(button);
            }

            // Save button

            {
                var button = document.createElement('button');
                button.innerHTML = 'Salveaza';
                button.className = 'button';
                button.onclick = User.saveProfile;
                p.appendChild(button);
            }
        }
    }

    static async saveProfile() {
        let data = {};

        // Profile data
        data.profile = {};
        data.profile.position = document.getElementById('position').value;
        data.profile.employer = document.getElementById('employer').value;
        data.profile.lastName = document.getElementById('lastName').value;
        data.profile.firstName = document.getElementById('firstName').value;
        data.profile.email = document.getElementById('email').value;
        data.profile.phone = document.getElementById('phone').value;
        data.profile.city = document.getElementById('city').value;
        data.profile.county = document.getElementById('county').value;
        data.profile.birthDate = document.getElementById('birthDate').value;

        for (let key in data.profile) {
            if (data.profile[key] == '') {
                alert('Toate campurile sunt obligatorii!');
                return;
            }
        }


        // Experience data
        data.experience = [];

        let exp = document.getElementById('experience-container').querySelectorAll('.one-experience-container');

        exp.forEach(e => {
            let obj = {};
            obj.position = e.querySelector('input[name="position"]').value;
            obj.employer = e.querySelector('input[name="employer"]').value;
            obj.startDate = e.querySelector('input[name="startDate"]').value;
            obj.endDate = e.querySelector('input[name="endDate"]').value;
            obj.description = e.querySelector('textarea[name="description"]').value;

            var ok = true;
            for (let key in obj) {
                if (obj[key] == '') {
                    ok = false;
                    return;
                }
            }

            if (ok == true)
                data.experience.push(obj);
        });

        // Education data

        data.education = [];

        let edu = document.getElementById('education-container').querySelectorAll('.one-education-container');

        edu.forEach(e => {
            let obj = {};
            obj.institution = e.querySelector('input[name="institution"]').value;
            obj.specialization = e.querySelector('input[name="specialization"]').value;
            obj.startDate = e.querySelector('input[name="startDate"]').value;
            obj.endDate = e.querySelector('input[name="endDate"]').value;
            obj.description = e.querySelector('textarea[name="description"]').value;

            var ok = true;
            for (let key in obj) {
                if (obj[key] == '') {
                    ok = false;
                    return;
                }
            }

            if (ok == true)
                data.education.push(obj);
        });

        // Skills data

        data.skills = [];

        let sk = document.getElementById('skills-container').querySelectorAll('.one-skill-container');

        sk.forEach(e => {
            let obj = {};
            obj.skill = e.querySelector('input[name="skill"]').value;
            obj.level = e.querySelector('select[name="level"]').value;
            obj.where = e.querySelector('input[name="where"]').value;

            var ok = true;
            for (let key in obj) {
                if (obj[key] == '') {
                    ok = false;
                    return;
                }
            }

            if (ok == true)
                data.skills.push(obj);
        });

        // Languages data

        data.languages = [];

        let lang = document.getElementById('languages-container').querySelectorAll('.one-language-container');

        lang.forEach(e => {
            let obj = {};
            obj.language = e.querySelector('input[name="language"]').value;
            obj.level = e.querySelector('select[name="level"]').value;

            var ok = true;
            for (let key in obj) {
                if (obj[key] == '') {
                    ok = false;
                    return;
                }
            }

            if (ok == true)
                data.languages.push(obj);

        });

        await fetch('../recrutareData/api/user/saveProfile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: sessionStorage.getItem('id'),
                data: data,
            })
        })
            .then(response => response.json())
            .then(result => {
                User.createProfilePage();
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    static async populateProfilePage(data) {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.selectButton('Profil');

        var p = document.createElement('div');
        p.className = 'column';
        main.appendChild(p);

        var response = await fetch('../recrutareData/api/user/getProfile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: sessionStorage.getItem('id')
            })
        });


        var data = await response.json();

        var firstName = data.firstName;
        var lastName = data.lastName;
        var email = data.email;

        data.data = data.data.replace(/\n/g, '\\n');

        data = JSON.parse(data.data);


        // Profile card
        {
            var card = document.createElement('div');
            card.className = 'data-card';
            card.id = 'profile';
            p.appendChild(card);

            var span = document.createElement('span');
            span.innerHTML = 'Profil';
            span.className = 'span-color';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            var row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            row.style.marginTop = '1rem';
            card.appendChild(row);

            var rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Pozitie';
            span.className = 'span-gray';
            rr.appendChild(span);

            var input = document.createElement('input');
            input.type = 'text';
            input.id = 'position';
            input.value = data.profile.position;
            rr.appendChild(input);

            rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Angajator';
            span.className = 'span-gray';
            rr.appendChild(span);

            input = document.createElement('input');
            input.type = 'text';
            input.id = 'employer';
            input.value = data.profile.employer;
            rr.appendChild(input);

            row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            row.style.marginTop = '1rem';
            card.appendChild(row);

            rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Nume';
            span.className = 'span-gray';
            rr.appendChild(span);

            input = document.createElement('input');
            input.type = 'text';
            input.id = 'lastName';
            input.value = lastName;
            input.disabled = true;
            rr.appendChild(input);

            rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Prenume';
            span.className = 'span-gray';
            rr.appendChild(span);

            input = document.createElement('input');
            input.type = 'text';
            input.id = 'firstName';
            input.value = firstName;
            input.disabled = true;
            rr.appendChild(input);

            row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            row.style.marginTop = '1rem';
            card.appendChild(row);

            rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Email';
            span.className = 'span-gray';
            rr.appendChild(span);

            input = document.createElement('input');
            input.type = 'text';
            input.id = 'email';
            input.value = email;
            input.disabled = true;
            rr.appendChild(input);

            rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Telefon';
            span.className = 'span-gray';
            rr.appendChild(span);

            input = document.createElement('input');
            input.type = 'text';
            input.id = 'phone';
            input.value = data.profile.phone;
            rr.appendChild(input);

            row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            row.style.marginTop = '1rem';
            card.appendChild(row);

            rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Oras';
            span.className = 'span-gray';
            rr.appendChild(span);

            input = document.createElement('input');
            input.type = 'text';
            input.id = 'city';
            input.value = data.profile.city;
            rr.appendChild(input);

            rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Judet';
            span.className = 'span-gray';
            rr.appendChild(span);

            input = document.createElement('input');
            input.type = 'text';
            input.id = 'county';
            input.value = data.profile.county;
            rr.appendChild(input);

            row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            row.style.marginTop = '1rem';
            card.appendChild(row);

            rr = document.createElement('div');
            rr.className = 'rr';
            row.appendChild(rr);

            span = document.createElement('span');
            span.innerHTML = 'Data nasterii';
            span.className = 'span-gray';
            rr.appendChild(span);

            input = document.createElement('input');
            input.type = 'date';
            input.id = 'birthDate';
            input.value = data.profile.birthDate;
            rr.appendChild(input);
        }

        // Experience card

        {
            card = document.createElement('div');
            card.className = 'data-card';
            card.id = 'experience';
            p.appendChild(card);

            span = document.createElement('span');
            span.innerHTML = 'Experienta';
            span.className = 'span-color';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            var colExp = document.createElement('div');
            colExp.className = 'column';
            colExp.style.width = '100%';
            colExp.id = 'experience-container';
            card.appendChild(colExp);

            data.experience.forEach(e => {
                var div = User.createExeperienceContainer();
                div.querySelector('input[name="position"]').value = e.position;
                div.querySelector('input[name="employer"]').value = e.employer;
                div.querySelector('input[name="startDate"]').value = e.startDate;
                div.querySelector('input[name="endDate"]').value = e.endDate;
                div.querySelector('textarea[name="description"]').value = e.description;
                colExp.appendChild(div);
            });

            var button = document.createElement('button');
            button.innerHTML = 'Adauga';
            button.className = 'button';
            button.onclick = function () {
                colExp.appendChild(User.createExeperienceContainer());
            }
            card.appendChild(button);
        }

        // Education card

        {
            card = document.createElement('div');
            card.className = 'data-card';
            card.id = 'education';
            p.appendChild(card);

            span = document.createElement('span');
            span.innerHTML = 'Educatie';
            span.className = 'span-color';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            var colEdu = document.createElement('div');
            colEdu.className = 'column';
            colEdu.style.width = '100%';
            colEdu.id = 'education-container';
            card.appendChild(colEdu);

            data.education.forEach(e => {
                var div = User.createEducationContainer();
                div.querySelector('input[name="institution"]').value = e.institution;
                div.querySelector('input[name="specialization"]').value = e.specialization;
                div.querySelector('input[name="startDate"]').value = e.startDate;
                div.querySelector('input[name="endDate"]').value = e.endDate;
                div.querySelector('textarea[name="description"]').value = e.description;
                colEdu.appendChild(div);
            });

            var button = document.createElement('button');
            button.innerHTML = 'Adauga';
            button.className = 'button';
            button.onclick = function () {
                colEdu.appendChild(User.createEducationContainer());
            }
            card.appendChild(button);
        }

        // Skills card

        {
            card = document.createElement('div');
            card.className = 'data-card';
            card.id = 'skills';
            p.appendChild(card);

            span = document.createElement('span');
            span.innerHTML = 'Skill-uri';
            span.className = 'span-color';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            var colSk = document.createElement('div');
            colSk.id = 'skills-container';
            colSk.className = 'column';
            colSk.style.width = '100%';
            card.appendChild(colSk);

            data.skills.forEach(e => {
                var div = User.createSkillContainer();
                div.querySelector('input[name="skill"]').value = e.skill;
                div.querySelector('select[name="level"]').value = e.level;
                div.querySelector('input[name="where"]').value = e.where;
                colSk.appendChild(div);
            });

            var button = document.createElement('button');
            button.innerHTML = 'Adauga';
            button.className = 'button';
            button.onclick = function () {
                colSk.appendChild(User.createSkillContainer());
            }
            card.appendChild(button);

        }

        // Languages card

        {
            card = document.createElement('div');
            card.className = 'data-card';
            card.id = 'languages';
            p.appendChild(card);

            span = document.createElement('span');
            span.innerHTML = 'Limbi straine';
            span.className = 'span-color';
            span.style.fontSize = '1.5rem';
            card.appendChild(span);

            var colLang = document.createElement('div');
            colLang.id = 'languages-container';
            colLang.className = 'column';
            colLang.style.width = '100%';
            card.appendChild(colLang);

            data.languages.forEach(e => {
                var div = User.createLanguageContainer();
                div.querySelector('input[name="language"]').value = e.language;
                div.querySelector('select[name="level"]').value = e.level;
                colLang.appendChild(div);
            });

            var button = document.createElement('button');
            button.innerHTML = 'Adauga';
            button.className = 'button';
            button.onclick = function () {
                colLang.appendChild(User.createLanguageContainer());
            }
            card.appendChild(button);
        }

        var button = document.createElement('button');
        button.innerHTML = 'Salveaza';
        button.className = 'button';
        button.onclick = User.saveProfile;
        p.appendChild(button);
    }

    static async createMyJobsPage() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.selectButton('Job-urile mele');

        var response = await fetch('../recrutareData/api/user/getMyJobs.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: sessionStorage.getItem('id')
            })
        });

        var data = await response.json();

        console.log(data);

        var p = document.createElement('div');
        p.className = 'column';
        main.appendChild(p);

        var table = document.createElement('table');
        table.className = 'data-table';
        p.appendChild(table);

        var tr = document.createElement('tr');
        table.appendChild(tr);

        var th = document.createElement('th');
        th.innerHTML = 'Titlu';
        tr.appendChild(th);

        th = document.createElement('th');
        th.innerHTML = 'Sfarsit recrutare';
        tr.appendChild(th);

        th = document.createElement('th');
        th.innerHTML = 'Status';
        tr.appendChild(th);

        th = document.createElement('th');
        th.innerHTML = 'Inceput meet';
        tr.appendChild(th);

        th = document.createElement('th');
        th.innerHTML = 'Sfarsit meet';
        tr.appendChild(th);

        th = document.createElement('th');
        th.innerHTML = 'Nume meet';
        tr.appendChild(th);

        data.forEach(e => {
            tr = document.createElement('tr');
            table.appendChild(tr);

            var td = document.createElement('td');
            td.innerHTML = e.title;
            tr.appendChild(td);

            td = document.createElement('td');
            var date = new Date(e.end_date * 1000);
            td.innerHTML = date.getDate().toString().padStart(2, '0') + '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear();
            tr.appendChild(td);

            td = document.createElement('td');
            if (e.status == 'applied')
                td.innerHTML = 'Aplicat';
            else if (e.status == 'cv_viewed')
                td.innerHTML = 'CV vizualizat';
            else if (e.status == 'interview_hr')
                td.innerHTML = 'Interviu HR';
            else if (e.status == 'tech_test')
                td.innerHTML = 'Test tehnic';
            else if (e.status == 'interview_tech')
                td.innerHTML = 'Interviu tehnic';
            else if (e.status == 'offer')
                td.innerHTML = 'Oferta';
            else if (e.status == 'rejected')
                td.innerHTML = 'Respins';
            else if (e.status == 'hired')
                td.innerHTML = 'Angajat';
            tr.appendChild(td);

            td = document.createElement('td');
            if (e.meet_start != null) {
                date = new Date(e.meet_start * 1000);
                td.innerHTML = date.getDate().toString().padStart(2, '0') + '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear()
                    + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
            }
            else {
                td.innerHTML = 'N/A';
            }
            tr.appendChild(td);

            td = document.createElement('td');
            if (e.meet_end != null) {
                date = new Date(e.meet_end * 1000);
                td.innerHTML = date.getDate().toString().padStart(2, '0') + '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear() + ' '
                    + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
            }
            else {
                td.innerHTML = 'N/A';
            }
            tr.appendChild(td);

            td = document.createElement('td');
            if (e.meet_name != null) {
                td.innerHTML = e.meet_name;
            }
            else {
                td.innerHTML = 'N/A';
            }
            tr.appendChild(td);
        });
    }
}

class Org {
    static async createMainPage() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.selectButton('Acasa');

        var p = document.createElement('div');
        p.className = 'column';
        main.appendChild(p);

        var card = document.createElement('div');
        card.className = 'data-card';
        p.appendChild(card);

        var span = document.createElement('span');
        span.innerHTML = 'Date Job';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        card.appendChild(span);

        var row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        var rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Titlu';
        span.className = 'span-gray';
        rr.appendChild(span);

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'title';
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Sfarsit recrutare';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'date';
        input.id = 'endDate';
        rr.appendChild(input);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Tip';
        span.className = 'span-gray';
        rr.appendChild(span);

        var select = document.createElement('select');
        select.id = 'type';
        rr.appendChild(select);

        var option = document.createElement('option');
        option.value = 'Full Time';
        option.innerHTML = 'Full Time';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Part Time';
        option.innerHTML = 'Part Time';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Contract';
        option.innerHTML = 'Contract';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Internship';
        option.innerHTML = 'Internship';
        select.appendChild(option);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Mod';
        span.className = 'span-gray';
        rr.appendChild(span);

        select = document.createElement('select');
        select.id = 'mode';
        rr.appendChild(select);

        option = document.createElement('option');
        option.value = 'Remote';
        option.innerHTML = 'Remote';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'On Site';
        option.innerHTML = 'On Site';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Hybrid';
        option.innerHTML = 'Hybrid';
        select.appendChild(option);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Locatie';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.id = 'location';
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Nivel';
        span.className = 'span-gray';
        rr.appendChild(span);

        select = document.createElement('select');
        select.id = 'level';
        rr.appendChild(select);

        option = document.createElement('option');
        option.value = 'Entry Level';
        option.innerHTML = 'Entry Level';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Junior Level';
        option.innerHTML = 'Junior Level';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Mid Level';
        option.innerHTML = 'Mid Level';
        select.appendChild(option);

        option = document.createElement('option');
        option.value = 'Senior Level';
        option.innerHTML = 'Senior Level';
        select.appendChild(option);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Salariu minim';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'number';
        input.id = 'salaryStart';
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Salariu maxim';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'number';
        input.id = 'salaryEnd';
        rr.appendChild(input);

        card = document.createElement('div');
        card.className = 'data-card';
        p.appendChild(card);

        span = document.createElement('span');
        span.innerHTML = 'Descriere Job';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        card.appendChild(span);

        var text = document.createElement('textarea');
        text.placeholder = 'Descriere';
        text.id = 'description';
        text.style.width = '100%';
        text.style.height = '7rem';
        text.style.marginTop = '1rem';
        card.appendChild(text);

        span = document.createElement('span');
        span.innerHTML = 'Cerinte';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        span.style.marginTop = '2rem';
        card.appendChild(span);

        text = document.createElement('textarea');
        text.placeholder = 'Cerinte';
        text.id = 'requirements';
        text.style.width = '100%';
        text.style.height = '7rem';
        text.style.marginTop = '1rem';
        card.appendChild(text);

        span = document.createElement('span');
        span.innerHTML = 'Responsabilitati';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        span.style.marginTop = '2rem';
        card.appendChild(span);

        text = document.createElement('textarea');
        text.placeholder = 'Responsabilitati';
        text.id = 'responsabilities';
        text.style.width = '100%';
        text.style.height = '7rem';
        text.style.marginTop = '1rem';
        card.appendChild(text);

        span = document.createElement('span');
        span.innerHTML = 'Beneficii';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        span.style.marginTop = '2rem';
        card.appendChild(span);

        text = document.createElement('textarea');
        text.placeholder = 'Beneficii';
        text.id = 'benefits';
        text.style.width = '100%';
        text.style.height = '7rem';
        text.style.marginTop = '1rem';
        card.appendChild(text);

        span = document.createElement('span');
        span.innerHTML = 'Despre noi';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        span.style.marginTop = '2rem';
        card.appendChild(span);

        text = document.createElement('textarea');
        text.placeholder = 'Despre noi';
        text.id = 'aboutUs';
        text.style.width = '100%';
        text.style.height = '7rem';
        text.style.marginTop = '1rem';
        card.appendChild(text);

        var button = document.createElement('button');
        button.innerHTML = 'Posteaza';
        button.className = 'button';
        button.onclick = Org.postJob;
        p.appendChild(button);
    }

    static async postJob() {
        var title = document.getElementById('title').value;
        var endDate = document.getElementById('endDate').value;
        var type = document.getElementById('type').value;
        var mode = document.getElementById('mode').value;
        var location = document.getElementById('location').value;
        var level = document.getElementById('level').value;
        var salaryStart = document.getElementById('salaryStart').value;
        var salaryEnd = document.getElementById('salaryEnd').value;
        var description = document.getElementById('description').value;
        var requirements = document.getElementById('requirements').value;
        var responsabilities = document.getElementById('responsabilities').value;
        var benefits = document.getElementById('benefits').value;
        var aboutUs = document.getElementById('aboutUs').value;

        if (title == '' || endDate == '' || location == '' || salaryStart == '' || salaryEnd == '' || description == '' || requirements == ''
            || responsabilities == '' || benefits == '' || aboutUs == '') {
            alert('Toate campurile sunt obligatorii!');
            return;
        }

        endDate = new Date(endDate);
        endDate.setHours(23, 59, 59);
        endDate = Math.floor(endDate.getTime() / 1000);

        var formData = new FormData();
        formData.append('title', title);
        formData.append('endDate', endDate);
        formData.append('type', type);
        formData.append('mode', mode);
        formData.append('location', location);
        formData.append('level', level);
        formData.append('salaryStart', salaryStart);
        formData.append('salaryEnd', salaryEnd);
        formData.append('description', description);
        formData.append('requirements', requirements);
        formData.append('responsabilities', responsabilities);
        formData.append('benefits', benefits);
        formData.append('aboutUs', aboutUs);
        formData.append('id', sessionStorage.getItem('id'));

        var response = await fetch('../recrutareData/api/org/postJob.php', {
            method: 'POST',
            body: formData
        });

        var data = await response.json();

        if (data.success == true) {
            Org.creatMyJobsPage();
        }
        else {
            alert('Eroare la postarea job-ului!');
        }
    }

    static async creatMyJobsPage() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.selectButton('Joburi');

        var response = await fetch('../recrutareData/api/org/getMyJobs.php?idorg=' + sessionStorage.getItem('id'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        var data = await response.json();

        var p = document.createElement('div');
        p.className = 'column';
        main.appendChild(p);

        data.forEach(e => {
            var card = document.createElement('div');
            card.className = 'data-card';
            p.appendChild(card);

            var row = document.createElement('div');
            row.className = 'row';
            row.style.width = '100%';
            row.style.justifyContent = 'center';
            card.appendChild(row);

            var span = document.createElement('span');
            span.innerHTML = e.title;
            span.className = 'span-color';
            span.style.fontSize = '1.5rem';
            row.appendChild(span);

            var button = document.createElement('button');
            button.innerHTML = 'Sterge';
            button.className = 'button';
            button.style.marginLeft = '2rem';
            button.style.marginTop = 0;
            button.onclick = function () {
                Jobs.deleteJob(e.id);
            }
            row.appendChild(button);


            e.applicants.forEach(c => {
                var row = document.createElement('div');
                row.className = 'row';
                row.style.width = '100%';
                row.style.flexWrap = 'wrap';
                row.style.marginTop = '2rem';
                card.appendChild(row);

                var rr = document.createElement('div');
                rr.className = 'row';
                rr.style.marginLeft = '4rem';
                rr.style.marginTop = '1rem';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Candidat';
                span.className = 'span-gray';
                rr.appendChild(span);

                span = document.createElement('span');
                span.innerHTML = c.firstName + ' ' + c.lastName;
                span.onclick = function () {
                    Org.showCandidate(c.iduser);
                }
                span.className = 'span-color';
                span.style.marginLeft = '1rem';
                rr.appendChild(span);

                rr = document.createElement('div');
                rr.className = 'row';
                rr.style.marginLeft = '4rem';
                rr.style.marginTop = '1rem';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Descarca CV';
                span.className = 'span-gray';
                rr.appendChild(span);

                var a = document.createElement('a');
                a.href = c.cv;
                a.download = 'CV.pdf';
                a.innerHTML = 'CV';
                a.className = 'span-color';
                a.style.marginLeft = '1rem';
                rr.appendChild(a);

                rr = document.createElement('div');
                rr.className = 'row';
                rr.style.marginLeft = '4rem';
                rr.style.marginTop = '1rem';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Status';
                span.className = 'span-gray';
                rr.appendChild(span);

                var select = document.createElement('select');
                select.id = 'status';
                select.style.width = '10rem';
                select.style.marginLeft = '2rem';
                select.onchange = function () {
                    Jobs.changeStatus(c.id, select.value);
                }
                rr.appendChild(select);

                var option = document.createElement('option');
                option.value = 'applied';
                option.innerHTML = 'Aplicat';
                if (c.status == 'applied')
                    option.selected = true;
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'cv_viewed';
                option.innerHTML = 'CV vizualizat';
                if (c.status == 'cv_viewed')
                    option.selected = true;
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'interview_hr';
                option.innerHTML = 'Interviu HR';
                if (c.status == 'interview_hr')
                    option.selected = true;
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'tech_test';
                option.innerHTML = 'Test tehnic';
                if (c.status == 'tech_test')
                    option.selected = true;
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'interview_tech';
                option.innerHTML = 'Interviu tehnic';
                if (c.status == 'interview_tech')
                    option.selected = true;
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'offer';
                option.innerHTML = 'Oferta';
                if (c.status == 'offer')
                    option.selected = true;
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'rejected';
                option.innerHTML = 'Respins';
                if (c.status == 'rejected')
                    option.selected = true;
                select.appendChild(option);

                option = document.createElement('option');
                option.value = 'hired';
                option.innerHTML = 'Angajat';
                if (c.status == 'hired')
                    option.selected = true;
                select.appendChild(option);

                row = document.createElement('div');
                row.className = 'row';
                row.style.width = '100%';
                row.style.flexWrap = 'wrap';
                row.style.marginTop = '2rem';
                card.appendChild(row);

                var rrStart = document.createElement('div');
                rrStart.className = 'row';
                rrStart.style.marginLeft = '4rem';
                rrStart.style.marginTop = '1rem';
                row.appendChild(rrStart);

                span = document.createElement('span');
                span.innerHTML = 'Start meeting';
                span.className = 'span-gray';
                rrStart.appendChild(span);

                var inputStart = document.createElement('input');
                inputStart.type = 'datetime-local';
                inputStart.id = 'startMeeting';
                inputStart.style.marginLeft = '2rem';
                if (c.meet_start != null) {
                    var date = new Date(c.meet_start * 1000);
                    inputStart.value = date.toISOString().slice(0, 16);
                }
                rrStart.appendChild(inputStart);

                rr = document.createElement('div');
                rr.className = 'row';
                rr.style.marginLeft = '4rem';
                rr.style.marginTop = '1rem';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Sfarsit meeting';
                span.className = 'span-gray';
                rr.appendChild(span);

                var inputEnd = document.createElement('input');
                inputEnd.type = 'datetime-local';
                inputEnd.id = 'endMeeting';
                if (c.meet_end != null) {
                    var date = new Date(c.meet_end * 1000);
                    inputEnd.value = date.toISOString().slice(0, 16);
                }
                inputEnd.style.marginLeft = '2rem';
                rr.appendChild(inputEnd);

                rr = document.createElement('div');
                rr.className = 'row';
                rr.style.marginLeft = '4rem';
                rr.style.marginTop = '1rem';
                row.appendChild(rr);

                span = document.createElement('span');
                span.innerHTML = 'Nume meeting';
                span.className = 'span-gray';
                rr.appendChild(span);

                var inputName = document.createElement('input');
                inputName.type = 'text';
                inputName.id = 'nameMeeting';
                if (c.meet_name != null)
                    inputName.value = c.meet_name;
                inputName.style.marginLeft = '2rem';
                rr.appendChild(inputName);

                button = document.createElement('button');
                button.innerHTML = 'Salveaza';
                button.className = 'button';
                button.style.marginTop = '0';
                button.style.marginLeft = '2rem';
                button.onclick = function () {
                    Jobs.saveMeeting(c.id, inputStart.value, inputEnd.value, inputName.value);
                }
                rr.appendChild(button);
            });
        });
    }

    static async showCandidate(id) {
        var response = await fetch('../recrutareData/api/org/getCandidate.php?id=' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        var data = await response.json();

        var main = document.querySelector('main');
        main.innerHTML = '';

        var p = document.createElement('div');
        p.className = 'column';
        main.appendChild(p);

        var firstName = data.firstName;
        var lastName = data.lastName;
        var email = data.email;

        data.data = data.data.replace(/\n/g, '\\n');

        data = JSON.parse(data.data);

        var card = document.createElement('div');
        card.className = 'data-card';
        p.appendChild(card);

        var span = document.createElement('span');
        span.innerHTML = 'Profil';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        card.appendChild(span);

        var row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        var rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Pozitie';
        span.className = 'span-gray';
        rr.appendChild(span);

        var input = document.createElement('input');
        input.type = 'text';
        input.value = data.profile.position;
        input.disabled = true;
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Angajator';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.value = data.profile.employer;
        input.disabled = true;
        rr.appendChild(input);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Nume';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.value = lastName;
        input.disabled = true;
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Prenume';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.value = firstName;
        input.disabled = true;
        rr.appendChild(input);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Email';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.value = email;
        input.disabled = true;
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Telefon';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.value = data.profile.phone;
        input.disabled = true;
        rr.appendChild(input);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Oras';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.value = data.profile.city;
        input.disabled = true;
        rr.appendChild(input);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Judet';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.value = data.profile.county;
        input.disabled = true;
        rr.appendChild(input);

        row = document.createElement('div');
        row.className = 'row';
        row.style.width = '100%';
        row.style.marginTop = '1rem';
        card.appendChild(row);

        rr = document.createElement('div');
        rr.className = 'rr';
        row.appendChild(rr);

        span = document.createElement('span');
        span.innerHTML = 'Data nasterii';
        span.className = 'span-gray';
        rr.appendChild(span);

        input = document.createElement('input');
        input.type = 'date';
        input.value = data.profile.birthDate;
        input.disabled = true;
        rr.appendChild(input);

        card = document.createElement('div');
        card.className = 'data-card';
        p.appendChild(card);

        span = document.createElement('span');
        span.innerHTML = 'Experienta';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        card.appendChild(span);

        var colExp = document.createElement('div');
        colExp.className = 'column';
        colExp.style.width = '100%';
        card.appendChild(colExp);

        data.experience.forEach(e => {
            var div = User.createExeperienceContainer();
            var d = div.querySelector('input[name="position"]');
            d.value = e.position;
            d.disabled = true;
            d = div.querySelector('input[name="employer"]');
            d.value = e.employer;
            d.disabled = true;
            d = div.querySelector('input[name="startDate"]');
            d.value = e.startDate;
            d.disabled = true;
            d = div.querySelector('input[name="endDate"]');
            d.value = e.endDate;
            d.disabled = true;
            d = div.querySelector('textarea[name="description"]');
            d.value = e.description;
            d.disabled = true;
            colExp.appendChild(div);
        });

        card = document.createElement('div');
        card.className = 'data-card';
        p.appendChild(card);

        span = document.createElement('span');
        span.innerHTML = 'Educatie';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        card.appendChild(span);

        var colEdu = document.createElement('div');
        colEdu.className = 'column';
        colEdu.style.width = '100%';
        card.appendChild(colEdu);

        data.education.forEach(e => {
            var div = User.createEducationContainer();
            var d = div.querySelector('input[name="institution"]');
            d.value = e.institution;
            d.disabled = true;
            d = div.querySelector('input[name="specialization"]');
            d.value = e.specialization;
            d.disabled = true;
            d = div.querySelector('input[name="startDate"]');
            d.value = e.startDate;
            d.disabled = true;
            d = div.querySelector('input[name="endDate"]');
            d.value = e.endDate;
            d.disabled = true;
            d = div.querySelector('textarea[name="description"]');
            d.value = e.description;
            d.disabled = true;
            colEdu.appendChild(div);
        });

        card = document.createElement('div');
        card.className = 'data-card';
        p.appendChild(card);

        span = document.createElement('span');
        span.innerHTML = 'Skill-uri';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        card.appendChild(span);

        var colSk = document.createElement('div');
        colSk.id = 'skills-container';
        colSk.className = 'column';
        colSk.style.width = '100%';
        card.appendChild(colSk);

        data.skills.forEach(e => {
            var div = User.createSkillContainer();
            var d = div.querySelector('input[name="skill"]');
            d.value = e.skill;
            d.disabled = true;
            d = div.querySelector('select[name="level"]');
            d.value = e.level;
            d.disabled = true;
            d = div.querySelector('input[name="where"]');
            d.value = e.where;
            d.disabled = true;
            colSk.appendChild(div);
        });

        card = document.createElement('div');
        card.className = 'data-card';
        p.appendChild(card);

        span = document.createElement('span');
        span.innerHTML = 'Limbi straine';
        span.className = 'span-color';
        span.style.fontSize = '1.5rem';
        card.appendChild(span);

        var colLang = document.createElement('div');
        colLang.id = 'languages-container';
        colLang.className = 'column';
        colLang.style.width = '100%';
        card.appendChild(colLang);

        data.languages.forEach(e => {
            var div = User.createLanguageContainer();
            var d = div.querySelector('input[name="language"]');
            d.value = e.language;
            d.disabled = true;
            d = div.querySelector('select[name="level"]');
            d.value = e.level;
            d.disabled = true;
            colLang.appendChild(div);
        });
    }
}
