/*eslint no-unused-expressions: 0*/
'use strict';

describe('Unit tests for QuestionEditCtrl', function () {
    var scope, httpBackend, broadcastSpy, browser,
        state = {
            go: function () {}
        },

        // Mock data
        stateParams = {
            questionId: 'questionId2',
            studyId: 'studyId',
            currentProject: 'projectId'
        },

        currentStudy = {
            name: 'test',
            description: 'test description',
            status: 'draft',
            _id: stateParams.studyId,
            questions: [{
                _id: 'questionId1',
                text: 'url1 question1',
                ordinal: 0,
                subOrdinal: 0,
                url: 'url1',
                type: 'Freeform'
            }, {
                _id: 'questionId2',
                text: 'url2 question1',
                ordinal: 1,
                subOrdinal: 0,
                url: 'url2',
                type: 'MultipleChoice',
                answerOptions: ['Answer1', 'Answer2']
            }]
        },
        currentStudyOriginal = angular.copy(currentStudy);

    var mockTaskCreator = function () {

        this.createTask = function () {};
        this.init = function () {};
    };

    beforeEach(module('UserResearch'));
    beforeEach(module('common.ui.elements'));
    beforeEach(module('shell.aside'));
    beforeEach(module('shell.dashboard'));
    beforeEach(module('shell.projectLandingPage'));
    beforeEach(module('UserResearch.utils'));

    beforeEach(module('ngResource'));
    beforeEach(module(function ($provide) {
        $provide.value('$stateParams', stateParams);
    }));

    beforeEach(inject(function ($injector, $rootScope, $controller, $httpBackend, $browser) {
        httpBackend = $httpBackend;
        browser = $browser;
        angular.copy(currentStudyOriginal, currentStudy);
        scope = $rootScope.$new();
        broadcastSpy = sinon.spy($rootScope, '$broadcast');

        scope.isEditStudy = true;
        scope.$parent.updateOrder = function () {};

        scope.currentQuestion = currentStudy.questions[1];

        /*
         * Need to also inject this controller due to
         * a dependency on a function that's called by functions
         * in these tests
         */
        $controller('QuestionsListCtrl', {
            $scope: scope,
            $state: state,
            currentStudy: currentStudy,
            Questions: $injector.get('Questions'),
            TaskCreator: mockTaskCreator
        });

        $controller('QuestionEditCtrl', {
            $scope: scope,
            $state: state,
            $stateParams: stateParams,
            Questions: $injector.get('Questions'),
            urUtil: function () {},
            $browser: browser
        });

    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // This will only delete once question as its now grouped by ordinal
    it('should delete two questions', function () {
        httpBackend.expect('DELETE', '/api/projects/projectId/studies/studyId/questions/questionId2/bulk').respond(204);
        expect(currentStudy.questions.length).to.be.equal(2);
        currentStudy.questions[0].url = 'url2';
        scope.currentUrl = 'url2';
        scope.deleteAll();
        httpBackend.flush();
        broadcastSpy.should.have.been.calledWith('dialog-close', 'editQuestionModal');
        expect(currentStudy.questions.length).to.be.equal(1);
    });

    it('should prevent empty multi-choice questions', function () {
        scope.currentQuestion.answerOptions[0] = '';
        scope.currentQuestion.answerOptions[1] = '';
        scope.done();
        broadcastSpy.should.not.have.been.calledWith('dialog-close', 'editQuestionModal');

        scope.currentQuestion.answerOptions[0] = 'Answer1';
        scope.done();
        broadcastSpy.should.not.have.been.calledWith('dialog-close', 'editQuestionModal');

        scope.currentQuestion.answerOptions[1] = 'Answer2';
        scope.done();
        broadcastSpy.should.have.been.calledWith('dialog-close', 'editQuestionModal');
    });

});
