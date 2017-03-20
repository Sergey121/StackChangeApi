import {Component, Inject} from '@angular/core';

import {template} from './home.component.pug';
import {style} from './home.component.scss';

import {QuestionsService} from '../../services/questionsService';

@Component({
    template: template,
    styles: [style],
    providers: [QuestionsService]
})
export class HomeComponent {
    constructor(@Inject(QuestionsService) questionService) {
        this.questionService = questionService;

        this.showModal = false;

        this.questions = [];

        this.params = {
            pagesize: 50,
            page: 1
        }
    }

    ngOnInit() {
       this.getQuestions();
    }

    getQuestions() {
        this.questionService.getAll(this.params).subscribe(data => {
            this.questions = this.questions.concat(data.items);
            this.params.page += 1;
        });
    }

    onScroll() {
        this.getQuestions();
    }

    onDetails(question) {
        this.questionService.get(question.question_id)
            .subscribe(data => {
                this.details = data.items[0];
                this.showModal = true;
            });

    }
}
